const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 6000;
const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.resolve(__dirname,'system')));
server.use(express.json());
server.set('json spaces',2);
server.use(session({
  secret: 'key-lilyane2',
  resave: false,
  saveUninitialized: true
}))

const users = [];

function cekLogin(req,res,next){
  if(req.session && req.session.user){
    next();
  } else {
    res.redirect('/login');
  }
}

function postHtml(filename,res){
  fs.readFile(filename,'utf8',(err,data) => {
    if(err){
      res.status(500).send('SERVER INTERNAL ERROR');
      return;
    }
    res.send(data);
  });
}

server.get('/home',(req,res) => {
  postHtml(__dirname + '/view/home.html',res);
});

server.get('/register', (req, res) => {
    postHtml(__dirname + '/view/register.html',res);
});

server.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = { name, email, password: hashedPassword };
    users.push(user);
    req.session.user = user; // Setel sesi pengguna setelah pendaftaran
    res.redirect('/dashboard');
});

server.get('/login', (req, res) => {
    postHtml(__dirname + '/view/login.html',res);
});

server.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = users.find(user => user.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).send('Email tidak terdaftar!!');
    }

    req.session.user = user; // Setel sesi pengguna setelah login
    res.redirect('/dashboard');
});

server.get('/dashboard', cekLogin, (req, res) => {
    const user = req.session.user;
    fs.readFile('./user/dashboard.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan.');
        }
        data = data.replace('[TITLE]', user.name);
        data = data.replace('[NAME_USER]', user.name);
        data = data.replace('[USER_NAME]', user.name);
        data = data.replace('[USER_EMAIL]', user.email);
        res.send(data);
    });
});

server.get('/logout', (req, res) => {
    req.session.destroy(); // Menghapus sesi pengguna saat logout
    res.redirect('/login');
});

server.listen(port,() => {
  console.log('Server runing on http://localhost:'+port);
});
server.use(require('./error/errorPage')); // pastikan selalu berada di posisi paling bawah