describe('Verify not log in redirects to sign up', function()
{
	it('Navigate to serve sign up', function(){
		cy.visit('https://development.serve.crossroads.net/');
	})
	it('Verify we are on sign in page', function(){
		cy.url().should('eq', 'https://int.crossroads.net/signin');
	})
})

describe('Verify signing in redirects back to serve', function(){
	it('Sign In', function(){
		cy.get('#login-page-email')
		.type('mpcrds+auto+verifyui@gmail.com');
		cy.get('#login-page-password')
		.type('welcome');
		cy.get('input[value="Sign in"]')
		.click();
	})
	it('Verify on sign up to serve', function(){
		cy.url().should('contain', 'development.serve.crossroads.net')
	})
})