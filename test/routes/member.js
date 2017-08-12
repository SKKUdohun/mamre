
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server/server';
import configure from '../../server/configure';
import { mysql } from '../../server/modules';

let should = chai.should();

chai.use(chaiHttp);

import {
    member
} from '../../server/routes/index';

//테스트 줄기 생성
describe('Server API Test', function() {

    /*
    모든 테스트가 실행되기 전에 mysql 연결
     */
    before(function() {
        mysql.makeConnection({
            host     : configure.DB_HOSTNAME,
            user     : configure.DB_USER,
            password : configure.DB_PASSWORD,
            database : configure.DB_NAME
        });

    });

    //테스트 줄기 생성
    //문자열은 출력용
    describe('Member Route Unit Test', function() {

        //직접적으로 시행되는 단위 테스트
        //it의 문자열은 출력용

        it('should insert new member with 1 point', function(done) {
            //server를 실행시키며 post 요청을 보냄
            //json 객체는 send를 통해 설정
            //end는 response 객체가 담김
            let now = new Date().getTime();
            chai.request(server)
                .post('/api/member/save')
                .send({'phone':'01087654321','datetime':now})
                .end(function(err, res) {
                    //json 데이터를 요청했으니 res.body가 존재해야함
                    should.exist(res.body);
                    //http 상태코드 200 (정상 코드)
                    res.should.have.status(200);
                    //res.body는 json 객체
                    res.body.should.be.a('object');
                    //res.body는 phone 프로퍼티를 가져야하고 값이 12345678901
                    res.body.should.have.property('phone').eql('01087654321');
                    //res.body는 point 프로퍼티를 가져야하고 값이 1
                    res.body.should.have.property('point').eql(1);
                    done();
                });
        });


        it('should add 1 point to member', function(done) {
            let now = new Date().getTime();
            chai.request(server)
                .post('/api/member/save')
                .send({'phone':'01087654321','datetime':now})
                .end(function(err, res) {
                    should.exist(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('phone').eql('01087654321');
                    res.body.should.have.property('point').eql(2);
                    done();
                });
        });



        it('should return a member', function(done) {
            chai.request(server)
                .get('/api/member/01087654321')
                .end(function(err, res) {
                    should.exist(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });


        it('should edit a member', function(done) {
          let now = new Date().getTime();
            chai.request(server)
                .post('/api/member/edit')
                .send({'phone':'01087654321','pointChange':-1,'name':'test', 'datetime':now})
                .end(function(err, res) {
                    should.exist(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    done();
                });
        });



        it('should return edited member', function(done) {
            chai.request(server)
                .get('/api/member/01087654321')
                .end(function(err, res) {
                    should.exist(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('phone').eql('01087654321');
                    res.body.should.have.property('point').eql(1);
                    res.body.should.have.property('name').eql('test');
                    done();
                });
        });

        it('should return rest of points', function(done){
          let now = new Date().getTime();
          chai.request(server)
            .post('/api/member/use')
            .send({'phone':'01087654321','usedPoint':1,'datetime':now})
            .end(function(err,res){
              should.exist(res.body);
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('newPoint').eql(0);
              done();
            });
        });

        it('should return an array of members', function(done) {
            chai.request(server)
                .get('/api/member/all')
                .end(function(err, res) {
                    should.exist(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('list');
                    res.body.list.should.be.a('array');
                    done();
                });
        });



        it('should delete a member', function(done) {
            chai.request(server)
                .post('/api/member/delete')
                .send({'phone':'01087654321'})
                .end(function(err, res) {
                    should.exist(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    done();
                });
        });


    });
    after(function() {
        mysql.getConnection().end();
    })
});
