const http2 = require('http2');

const fs = require('fs');
const path = require('path');
const users = {};

http2.createSecureServer({
    cert: fs.readFileSync(path.join(__dirname, '../Cert/server.crt')),
    key: fs.readFileSync(path.join(__dirname, "../Cert/server.key")),
    ca:[
        fs.readFileSync(path.join(__dirname, '../Cert/ca.crt')),
    ]
}, (req, res) => {
    if (req.method === 'GET') {
        if (req.url === '/') {
            return fs.readFile(path.join(__dirname, '../Client/front.html'), (err, data) => {
                if (err) {
                    throw err;
                }
                res.end(data);
            });
        }
        else if (req.url === '/about') {
            return fs.readFile(path.join(__dirname, '../Client/about.html'), (err, data) => {
                if (err) {
                    throw err;
                }
                res.end(data);
            });
        }
        else if (req.url === '/users') {
            return res.end(JSON.stringify(users));
        }
        else {
            return fs.readFile(path.join(__dirname, `../Client/${req.url}`), (err, data) => {
                if (err) {
                    res.writeHead(404, 'NOT FOUND');
                    return res.end('NOT FOUND');
                }
                return res.end(data);
            });
        }
    }
    else if (req.method === 'POdST') {
        if (req.url === '/users') {
            let body = '';
            req.on('data', (data) => {
                body += data;
            });
            return req.on('end', () => {
                console.log('POST 본문(Body):', body);
                const {name} = JSON.parse(body);
                const id = +new Date();
                users[id] = name;
                res.writeHead(201);
                res.end('등록 성공');
            });
        }
    }
    else if (req.method === 'PUT') {
        if (req.url.startsWith('/users/')) {
            const key = req.url.split('/')[2];
            let body = '';
            req.on('data', (data) => {
                body += data;
            });
            return req.on('end', () => {
                console.log('PUT 본문(Body):', body);
                users[key] = JSON.parse(body).name;
                return res.end(JSON.stringify(users));
            });
        }
    }
    else if (req.method === 'DELETE') {
        if (req.url.startsWith('/users/')) {
            const key = req.url.split('/')[2];
            delete users[key];
            return res.end(JSON.stringify(users));
        }
    }
    else {
        res.writeHead(404, 'NOT FOUND');
        return res.end('NOT FOUND');
    }
}).listen(8888, () => {
    console.log('8888번 포트에서 서버 대기중입니다');
});
