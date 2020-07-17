
/**
 * Put functions calling Okta's /api/v1/users endpoint here
 * https://developer.okta.com/docs/reference/api/users/
 */

const oktaAPIUsersEndpoint = `${Cypress.env('OKTA_API_SUBDOMAIN')}api/v1/users`;
const Authorization = `SSWS ${Cypress.env('OKTA_API_TESTING_TOKEN')}`;

/**
 * Create Cypress request for endpoint with most commonly used defaults
 * @param userId (string) Okta user's id or email
 * @param extension (string) Value after the "users" part of the endpoint
 */
function oktaAPIUserEndpointRequest(userId, extension = '') {
  const url = `${oktaAPIUsersEndpoint}/${userId}${extension}`;
  return {
    method: 'POST',
    url,
    headers: {
      Authorization
    },
    failOnStatusCode: false // Don't fail test if request not successful
  };
}

export function endUserSessions(oktaId) {
  const clearSessionRequest = oktaAPIUserEndpointRequest(oktaId, '/sessions');
  clearSessionRequest.method = 'DELETE';
  return cy.request(clearSessionRequest);
}