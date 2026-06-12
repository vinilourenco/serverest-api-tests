import { ENDPOINTS, SEEDED_IDS } from '../../support/constants'
const Chance = require('chance')

describe('Products - List Registered Products', () => {

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
            url: ENDPOINTS.PRODUCTS
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.quantidade).to.be.an('number')
            expect(response.body.produtos).to.be.an('array')
        })
    })

    it('TC002 - List all products by existent ID', () => {
        cy.request({
            method: 'GET',
            url: `${ENDPOINTS.PRODUCTS}?_id=${SEEDED_IDS.PRODUCT}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.quantidade).to.equal(1)
            expect(response.body.produtos).to.have.lengthOf(1)
            expect(response.body.produtos[0]).to.have.property('_id', SEEDED_IDS.PRODUCT)
        })
    })

    it('TC003 - List all products by existent name', () => {
        cy.wrap(productList.body.produtos).each((product) => {
            expect(product).to.be.an('object')
            const productName = product.nome

            cy.request({
                method: 'GET',
                url: `${ENDPOINTS.PRODUCTS}?nome=${productName}`
            }).then((response) => {
                expect(response.status).to.equal(200)
                response.body.produtos.forEach((p) => {
                    expect(p).to.have.property('nome', productName)
                })
            })
        })
    })

    it('TC004 - List all products by specific price', () => {
        cy.wrap(productList.body.produtos).each((product) => {
            expect(product).to.be.an('object')
            const productPrice = product.preco

            cy.request({
                method: 'GET',
                url: `${ENDPOINTS.PRODUCTS}?preco=${productPrice}`
            }).then((response) => {
                expect(response.status).to.equal(200)
                response.body.produtos.forEach((p) => {
                    expect(p).to.have.property('preco', productPrice)
                })
            })
        })
    })

    it('TC005 - List products filtering by description', () => {
        cy.wrap(productList.body.produtos).each((product) => {
            expect(product).to.be.an('object')
            const description = product.descricao

            cy.request({
                method: 'GET',
                url: `${ENDPOINTS.PRODUCTS}?descricao=${description}`
            }).then((response) => {
                expect(response.status).to.equal(200)
                response.body.produtos.forEach((p) => {
                    expect(p).to.have.property('descricao', description)
                })
            })
        })
    })

    it('TC006 - List products filtering by specific quantity', () => {
        cy.wrap(productList.body.produtos).each((product) => {
            expect(product).to.be.an('object')
            const quantity = product.quantidade

            cy.request({
                method: 'GET',
                url: `${ENDPOINTS.PRODUCTS}?quantidade=${quantity}`
            }).then((response) => {
                expect(response.status).to.equal(200)
                response.body.produtos.forEach((p) => {
                    expect(response.body.produtos[0]).to.have.property('quantidade', quantity)
                })
            })
        })
    })

    it('TC007 - List products filtering multiple combinations', () => {
        cy.wrap(productList.body.produtos).each((product) => {
            expect(product).to.be.an('object')
            const productName = product.nome
            const productPrice = product.preco

            cy.request({
                method: 'GET',
                url: `${ENDPOINTS.PRODUCTS}?nome=${productName}&preco=${productPrice}`
            }).then((response) => {
                const produto = response.body.produtos[0]
                expect(response.status).to.equal(200)
                response.body.produtos.forEach((p) => {
                    expect(produto).to.have.property('nome', productName)
                    expect(produto).to.have.property('preco', productPrice)
                })
            })
        })
    })

    it('TC008 - Shows empty list when there is no products registered', () => {
        cy.request({
            method: 'GET',
            url: `${ENDPOINTS.PRODUCTS}?nome=${randomName}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.quantidade).to.equal(0)
            expect(response.body.produtos).to.have.lengthOf(0)
        })
    })

    it('TC009 - Empty list for inexistent ID', () => {
        cy.request({
            method: 'GET',
            url: `${ENDPOINTS.PRODUCTS}?_id=${randomString}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.quantidade).to.equal(0)
            expect(response.body.produtos).to.have.lengthOf(0)
        })
    })

    it('TC010 - Empty list for inexistent product name', () => {
        cy.request({
            method: 'GET',
            url: `${ENDPOINTS.PRODUCTS}?nome=${randomString}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.quantidade).to.equal(0)
            expect(response.body.produtos).to.have.lengthOf(0)
        })
    })

    it('TC011 - Filter product list with case sensitive', () => {
        cy.wrap(productList.body.produtos).each((product) => {
            expect(product).to.be.an('object')
            const productName = product.nome
            const lowerCaseName = productName.toLowerCase()

            cy.request({
                method: 'GET',
                url: `${ENDPOINTS.PRODUCTS}?nome=${lowerCaseName}`
            }).then((response) => {
                expect(response.status).to.equal(200)
                response.body.produtos.forEach((p) => {
                    expect(p).to.have.property('nome', productName)
                })
            })
        })
    })

    it('TC014 - Filter product by extremely high price', () => {
        const highPrice = 999999

        cy.request({
            method: 'GET',
            url: `${ENDPOINTS.PRODUCTS}?preco=${highPrice}`
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
            url: `${ENDPOINTS.PRODUCTS}?quantidade=${highQuantity}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('object').and.to.have.all.keys('quantidade', 'produtos').and.to.satisfy((body) => {
                return body.quantidade === 0 && Array.isArray(body.produtos) && body.produtos.length === 0
            })
        })
    })

    it('TC017 - Filter product with blank space before and after the string', () => {
        const blankName = ' Mouse '

        cy.request({
            method: 'GET',
            url: `${ENDPOINTS.PRODUCTS}?nome=${encodeURIComponent(blankName)}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('object').and.to.have.all.keys('quantidade', 'produtos').and.to.satisfy((body) => {
                return body.quantidade === 0 && Array.isArray(body.produtos) && body.produtos.length === 0
            })
        })
    })

    it('TC018 - Filter product by empty description', () => {
        cy.request({
            method: 'GET',
            url: `${ENDPOINTS.PRODUCTS}?descricao=`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('object').and.to.have.all.keys('quantidade', 'produtos').and.to.satisfy((body) => {
                return body.quantidade >= 0 && Array.isArray(body.produtos) && body.produtos.length >= 0
            })
        })
    })

    it('TC019 - Filter product by multiples filter fields to return empty list', () => {
        const productPrice = 999999
        const productQuantity = 0
        const productName = 'Mouse'

        cy.request({
            method: 'GET',
            url: `${ENDPOINTS.PRODUCTS}?preco=${productPrice}&quantidade=${productQuantity}&nome=${productName}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('object').and.to.have.all.keys('quantidade', 'produtos').and.to.satisfy((body) => {
                return body.quantidade === 0 && Array.isArray(body.produtos) && body.produtos.length === 0
            })
        })
    })

    it('TC021 - Filter products with special encoding URL', () => {
        cy.wrap(productList.body.produtos).each((produto) => {
            expect(produto).to.be.an('object')
            const productName = produto.nome

            cy.request({
                method: 'GET',
                url: `${ENDPOINTS.PRODUCTS}?nome=${encodeURIComponent(productName)}`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.quantidade).to.be.greaterThan(0)
                response.body.produtos.forEach((p) => {
                    expect(p).to.have.property('nome', productName)
                })
            })
        })
    })
})
