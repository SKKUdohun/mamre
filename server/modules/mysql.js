import mysql from 'mysql';

let conn;

function makeConnection(params) {
    let connectionInfo;
    let connection;

    if(params['uri'])
        connectionInfo = params.uri;
    else {
        const properties = ['host','user','password','database'];

        let p = [];
        for(let i in params)
            p.push(i);

        for(let i of properties)
            if(!p.find((o)=>{return o===i}))
                throw new Error('DB 입력 정보가 잘못되었습니다. - '+i);

        connectionInfo = params;
    }

    connection = mysql.createConnection(connectionInfo);

    connection.connect((err) => {
        console.log('DB 연결완료');
        if(err) {
            console.log('error when connecting to db :', err);
            setTimeout(()=>{makeConnection(params)}, 2000);
        }
    });

    connection.on('error', (err) => {
        console.log("ERRR");
        if(err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET')
            makeConnection(params);
        else
            throw err;
    });

    conn = connection;

}

function getConnection() {
    return conn;
}

export default {
    makeConnection,
    getConnection
}
