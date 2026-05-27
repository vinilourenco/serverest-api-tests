const Chance = require('chance');

describe('Products - List Registered Products', () => {

    const defaultId = 'BeeJh5lz3k6kSIzA';
    const chance = new Chance()
    let randomName
    let randomString
    let productList = []

    beforeEach(() => {
        randomName = chance.name()
        randomString = Cypress._.repeat(chance.geohash(), 2)

        cy.listAllProducts()
            .then(response => {
                productList = response
            })
    })

    it('TC001 - List all products without filter', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/produtos`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.all.keys('quantidade', 'produtos').and.to.satisfy((body) => {
                return typeof body.quantidade === 'number' && Array.isArray(body.produtos)
            })
        })
    })

    it('TC002 - List all products by existent ID', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/produtos?_id=${defaultId}`,
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.all.keys('quantidade', 'produtos').and.to.satisfy((body) => {
                return body.quantidade === 1 && body.produtos.length === 1 && body.produtos[0]._id === defaultId
            })
        })
    })

    it('TC003 - List all products by existent name', () => {
        productList.body.produtos.forEach((product) => {
            expect(product).to.be.an('object')
            const productName = product.nome

            cy.request({
                method: 'GET',
                url: `${Cypress.config('baseUrl')}/produtos?nome=${productName}`
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.produtos[0]).to.have.property('nome', productName)
            })
        })
    })

    it('TC004 - List all products by specific price', () => {
        productList.body.produtos.forEach((product) => {
            expect(product).to.be.an('object')
            const productPrice = product.preco

            cy.request({
                method: 'GET',
                url: `${Cypress.config('baseUrl')}/produtos?preco=${productPrice}`
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.produtos[0]).to.have.property('preco', productPrice)
            })
        })
    })

    it('TC005 - List products filtering by description', () => {
        productList.body.produtos.forEach((product) => {
            expect(product).to.be.an('object')
            const description = product.descricao

            cy.request({
                method: 'GET',
                url: `${Cypress.config('baseUrl')}/produtos?descricao=${description}`
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.produtos[0]).to.have.property('descricao', description)
            })
        })
    })

    it('TC006 - List products filtering by specific quantity', () => {
        productList.body.produtos.forEach((product) => {
            expect(product).to.be.an('object')
            const quantity = product.quantidade

            cy.request({
                method: 'GET',
                url: `${Cypress.config('baseUrl')}/produtos?quantidade=${quantity}`
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.produtos[0]).to.have.property('quantidade', quantity)
            })
        })
    })

    it('TC007 - List products filtering multiple combinations', () => {
        productList.body.produtos.forEach((product) => {
            expect(product).to.be.an('object')
            const productName = product.nome
            const productPrice = product.preco

            cy.request({
                method: 'GET',
                url: `${Cypress.config('baseUrl')}/produtos?nome=${productName}&preco=${productPrice}`
            }).then((response) => {
                const produto = response.body.produtos[0]
                expect(response.status).to.equal(200)
                expect(produto).to.have.property('nome', productName)
                expect(produto).to.have.property('preco', productPrice)
            })
        })
    })

    it('TC008 - Shows empty list when there is no products registered', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/produtos?nome=${randomName}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('object').and.to.have.all.keys('quantidade', 'produtos').and.to.satisfy((body) => {
                return body.quantidade === 0 && Array.isArray(body.produtos) && body.produtos.length === 0
            })
        })
    })

    it('TC009 - Empty list for inexistent ID', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/produtos?_id=${randomString}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('object').and.to.have.all.keys('quantidade', 'produtos').and.to.satisfy((body) => {
                return body.quantidade === 0 && Array.isArray(body.produtos) && body.produtos.length === 0
            })
        })
    })

    it('TC010 - Empty list for inexistent product name', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/produtos?nome=${randomString}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('object').and.to.have.all.keys('quantidade', 'produtos').and.to.satisfy((body) => {
                return body.quantidade === 0 && Array.isArray(body.produtos) && body.produtos.length === 0
            })
        })
    })

    it('TC011 - Filter product list with case sensitive', () => {
        productList.body.produtos.forEach((product) => {
            expect(product).to.be.an('object')
            const productName = product.nome
            const lowerCaseName = productName.toLowerCase()

            cy.request({
                method: 'GET',
                url: `${Cypress.config('baseUrl')}/produtos?nome=${lowerCaseName}`
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.produtos[0]).to.have.property('nome', productName)
            })
        })
    })

    it('TC014 - Filter product by extremely high price', () => {
        const highPrice = 999999

        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/produtos?preco=${highPrice}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('object').and.to.have.all.keys('quantidade', 'produtos').and.to.satisfy((body) => {
                return body.quantidade === 0 && Array.isArray(body.produtos) && body.produtos.length === 0
            })
        })
    })

    it('TC016 - Filter product by high quantity', () => {
        const highQuantity = 999999

        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/produtos?quantidade=${highQuantity}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('object').and.to.have.all.keys('quantidade', 'produtos').and.to.satisfy((body) => {
                return body.quantidade === 0 && Array.isArray(body.produtos) && body.produtos.length === 0
            })
        })
    })

    it.only('TC017 - Filter product with blank space before and after the string', () => {
        const blankName = ' Mouse '

        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/produtos?nome=${blankName}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('object').and.to.have.all.keys('quantidade', 'produtos').and.to.satisfy((body) => {
                return body.quantidade === 0 && Array.isArray(body.produtos)
            })
        })
    })
})