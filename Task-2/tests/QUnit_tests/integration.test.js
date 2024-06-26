const baseUrl = 'http://localhost:3030/';

let user = {
    email: '',
    password: '123456'
};

let token = '';
let userId = '';

let lastCreatedBook = '';

let book = {
    title: '',
    description: '',
    imageUrl: '/images/book.png',
    type: 'Other'
}

QUnit.config.reorder = false;

QUnit.module('User functionalities', ()=>{
    QUnit.test('User registration', async(assert)=>{

        let path = 'users/register';
        let random = Math.floor(Math.random() * 10000);
        let email = `abv${random}@abv.bg`;
        
        user.email = email;


        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify(user)
        });

        let json = await response.json();
        console.log(json);


        assert.ok(response.ok);

        assert.ok(json.hasOwnProperty('email'), 'Email property exists');
        assert.equal(json.email, user.email, 'Email has correct value');
        assert.strictEqual(typeof json.email, 'string', 'Email has correct type');

        assert.ok(json.hasOwnProperty('password'), 'password property exists');
        assert.equal(json.password, user.password, 'password has correct value');
        assert.strictEqual(typeof json.password, 'string', 'password has correct type');

        assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn property exists');
        assert.strictEqual(typeof json._createdOn, 'number', '_createdOn has correct type');

        assert.ok(json.hasOwnProperty('_id'), '_id property exists');
        assert.strictEqual(typeof json._id, 'string', '_id has correct type');

        assert.ok(json.hasOwnProperty('accessToken'), 'accessToken property exists');
        assert.strictEqual(typeof json.accessToken, 'string', 'accessToken has correct type');

        token = json.accessToken;
        userId = json._id;
        sessionStorage.setItem('book-user', JSON.stringify(user));
        

    });
    QUnit.test('Login', async (assert)=>{

        let path = 'users/login';


        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify(user)
        });

        let json = await response.json();
        console.log(json);

        //assert
        assert.ok(response.ok);

        assert.ok(json.hasOwnProperty('email'), 'Email property exists');
        assert.equal(json.email, user.email, 'Email has correct value');
        assert.strictEqual(typeof json.email, 'string', 'Email has correct type');

        assert.ok(json.hasOwnProperty('password'), 'password property exists');
        assert.equal(json.password, user.password, 'password has correct value');
        assert.strictEqual(typeof json.password, 'string', 'password has correct type');

        assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn property exists');
        assert.strictEqual(typeof json._createdOn, 'number', '_createdOn has correct type');

        assert.ok(json.hasOwnProperty('_id'), '_id property exists');
        assert.strictEqual(typeof json._id, 'string', '_id has correct type');

        assert.ok(json.hasOwnProperty('accessToken'), 'accessToken property exists');
        assert.strictEqual(typeof json.accessToken, 'string', 'accessToken has correct type');

        token = json.accessToken;
        userId = json._id;
        sessionStorage.setItem('book-user', JSON.stringify(user));
    });
});
QUnit.module('Book functionalities', ()=>{

    QUnit.test('Get all books', async (assert)=>{
        let path = 'data/books';
        let queryParams = '?sortBy=_createdOn%20desc';



        let response = await fetch(baseUrl + path + queryParams);

        let json = await response.json();

        assert.ok(response.ok, 'response is ok');

        assert.ok(Array.isArray(json), 'response is Array');

        json.forEach(jsonData => {
            assert.ok(jsonData.hasOwnProperty('description'), 'Description property exists');
            assert.strictEqual(typeof jsonData.description, 'string', 'description is correct type');

            assert.ok(jsonData.hasOwnProperty('imageUrl'), 'imageUrl property exists');
            assert.strictEqual(typeof jsonData.imageUrl, 'string', 'imageUrl is correct type');

            assert.ok(jsonData.hasOwnProperty('title'), 'title property exists');
            assert.strictEqual(typeof jsonData.title, 'string', 'title is correct type');

            assert.ok(jsonData.hasOwnProperty('type'), 'type property exists');
            assert.strictEqual(typeof jsonData.type, 'string', 'type is correct type');

            assert.ok(jsonData.hasOwnProperty('_createdOn'), '_createdOn property exists');
            assert.strictEqual(typeof jsonData._createdOn, 'number', '_createdOn is correct type');

            assert.ok(jsonData.hasOwnProperty('_id'), '_id property exists');
            assert.strictEqual(typeof jsonData._id, 'string', '_id is correct type');

            assert.ok(jsonData.hasOwnProperty('_ownerId'), '_ownerId property exists');
            assert.strictEqual(typeof jsonData._ownerId, 'string', '_ownerId is correct type');

        });

    });

    QUnit.test('Create book', async(assert)=>{

        let path = 'data/books';

        let random = Math.floor(Math.random()* 10000);

        book.title = `Random title${random}`;
        book.description = `Random description${random}`;


        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type' : 'application/json',
                'X-Authorization' : token
            }, 
            body: JSON.stringify(book)
        });

            let json = await response.json();

            assert.ok(response.ok, 'response is OK');

        
        
            assert.ok(json.hasOwnProperty('description'), 'Description property exists');
            assert.strictEqual(json.description, book.description, 'description has correct value')
            assert.strictEqual(typeof json.description, 'string', 'description is correct type');

            assert.ok(json.hasOwnProperty('imageUrl'), 'imageUrl property exists');
            assert.strictEqual(json.imageUrl, book.imageUrl, 'correct image URL');
            assert.strictEqual(typeof json.imageUrl, 'string', 'imageUrl is correct type');

            assert.ok(json.hasOwnProperty('title'), 'title property exists');
            assert.strictEqual(json.title, book.title, 'correct title');
            assert.strictEqual(typeof json.title, 'string', 'title is correct type');

            assert.ok(json.hasOwnProperty('type'), 'type property exists');
            assert.strictEqual(json.type, book.type, 'correct type');
            assert.strictEqual(typeof json.type, 'string', 'type property is correct type');

            assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn property exists');
            assert.strictEqual(typeof json._createdOn, 'number', '_createdOn is correct type');

            assert.ok(json.hasOwnProperty('_id'), '_id property exists');
            assert.strictEqual(typeof json._id, 'string', '_id is correct type');

            assert.ok(json.hasOwnProperty('_ownerId'), '_ownerId property exists');
            assert.strictEqual(json._ownerId, userId, 'ownerId is correct')
            assert.strictEqual(typeof json._ownerId, 'string', '_ownerId is correct type');

            lastCreatedBook = json._id;

        
    });

    QUnit.test('Edit book', async (assert)=>{

        let path = 'data/books';
        let random = Math.floor(Math.random()* 10000);

        book.title = `Edited title${random}`;


        let response = await fetch(baseUrl + path + `/${lastCreatedBook}`, {
            method: 'PUT',
            headers: {
                'content-type' : 'application/json',
                'X-Authorization' : token
            }, 
            body: JSON.stringify(book)
        });

            let json = await response.json();

            assert.ok(response.ok);
            assert.ok(json.hasOwnProperty('description'), 'Description property exists');
            assert.strictEqual(json.description, book.description, 'description has correct value')
            assert.strictEqual(typeof json.description, 'string', 'description is correct type');

            assert.ok(json.hasOwnProperty('imageUrl'), 'imageUrl property exists');
            assert.strictEqual(json.imageUrl, book.imageUrl, 'correct image URL');
            assert.strictEqual(typeof json.imageUrl, 'string', 'imageUrl is correct type');

            assert.ok(json.hasOwnProperty('title'), 'title property exists');
            assert.strictEqual(json.title, book.title, 'correct title');
            assert.strictEqual(typeof json.title, 'string', 'title is correct type');

            assert.ok(json.hasOwnProperty('type'), 'type property exists');
            assert.strictEqual(json.type, book.type, 'correct type');
            assert.strictEqual(typeof json.type, 'string', 'type property is correct type');

            assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn property exists');
            assert.strictEqual(typeof json._createdOn, 'number', '_createdOn is correct type');

            assert.ok(json.hasOwnProperty('_id'), '_id property exists');
            assert.strictEqual(typeof json._id, 'string', '_id is correct type');

            assert.ok(json.hasOwnProperty('_ownerId'), '_ownerId property exists');
            assert.strictEqual(json._ownerId, userId, 'ownerId is correct')
            assert.strictEqual(typeof json._ownerId, 'string', '_ownerId is correct type');
    });

    QUnit.test('Delete a book', async(assert)=>{
        let path = 'data/books';

        let response = await fetch(baseUrl + path + `/${lastCreatedBook}`, {
            method: 'DELETE',
            headers: {
                'X-Authorization' : token
            }, 
            body: JSON.stringify(book)
        });
        assert.ok(response.ok);
    })

})