Cypress.Commands.add('editUserSuccess', (response) => {
    expect(response.status).to.equal(200)
    expect(response.body).to.have.all.keys('message')
    expect(response.body.message).to.equal('Registro alterado com sucesso')
})

Cypress.Commands.add('loginSuccess', (response) => {
    expect(response.status).to.equal(200)
    expect(response.body.message).to.be.a('string').that.includes('Login realizado com sucesso')
    expect(response.body.authorization).to.be.a('string').that.includes('Bearer')
})

Cypress.Commands.add('loginUnauthorized', (response) => {
    expect(response.status).to.equal(401)
    expect(response.body).to.have.property('message').that.includes('inválidos')
})

Cypress.Commands.add('registerUserSuccess', (response) => {
    expect(response.status).to.equal(201)
    expect(response.body).to.have.property('message').that.includes('Cadastro realizado com sucesso')
    expect(response.body).to.have.property('_id').that.is.a('string').and.not.empty
})

Cypress.Commands.add('createUserViaPut', (response) => {
    expect(response.status).to.equal(201)
    expect(response.body).to.have.all.keys('message', '_id')
    expect(response.body._id).to.be.a('string').and.have.length.greaterThan(0)
})

Cypress.Commands.add('deleteUserSuccess', (response) => {
    expect(response.status).to.equal(200)
    expect(response.body.message).to.equal('Registro excluído com sucesso')
})

Cypress.Commands.add('deleteNonExistentUserSuccess', (response) => {
    expect(response.status).to.equal(200)
    expect(response.body).to.have.property('message').that.includes('Nenhum registro excluído')
})

Cypress.Commands.add('deleteUserWithCartError', (response) => {
    expect(response.status).to.equal(400)
    expect(response.body.message).to.be.a('string').that.includes('Não é permitido excluir usuário com carrinho cadastrado')
    expect(response.body.idCarrinho).to.be.a('string').and.have.length.greaterThan(0)
})

Cypress.Commands.add('listUsersSuccess', (response) => {
    expect(response.status).to.equal(200)
    expect(response.body).to.include.all.keys('quantidade', 'usuarios')
})

Cypress.Commands.add('listUsersWithResults', (response) => {
    expect(response.status).to.equal(200)
    expect(response.body).to.have.property('usuarios').that.is.an('array').and.is.not.empty
})

Cypress.Commands.add('listUsersEmpty', (response) => {
    expect(response.status).to.equal(200)
    expect(response.body).to.have.property('usuarios').that.is.an('array').and.is.empty
})

Cypress.Commands.add('getUserSuccess', (response, id) => {
    expect(response.status).to.equal(200)
    expect(response.body).to.have.property('_id', id)
})

Cypress.Commands.add('listProductsSuccess', (response) => {
    expect(response.status).to.equal(200)
    expect(response.body.quantidade).to.be.a('number')
    expect(response.body.produtos).to.be.an('array')
})

Cypress.Commands.add('listProductsEmpty', (response) => {
    expect(response.status).to.equal(200)
    expect(response.body.quantidade).to.equal(0)
    expect(response.body.produtos).to.have.lengthOf(0)
})

Cypress.Commands.add('badRequestWithProperty', (response, property, message) => {
    expect(response.status).to.equal(400)
    expect(response.body).to.have.property(property).that.includes(message)
})
