Cypress.Commands.add('editUserSuccess', (response) => {
    expect(response.status).to.equal(200)
    expect(response.body).to.have.all.keys('message')
    expect(response.body.message).to.equal('Registro alterado com sucesso')
})
