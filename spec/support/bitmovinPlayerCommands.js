Cypress.Commands.add('subtitleOverlay', () => { 
  return cy.get('[class*="bmpui-ui-subtitle-overlay"] span').as('subtitleOverlay');
});

Cypress.Commands.add('subtitleSelect', () => {
  return cy.get('[class*="bmpui-ui-subtitleselectbox"]').as('subtitleSelect');
});

Cypress.Commands.add('mutedIndicator', () => {
  return cy.get('[class*="bmpui-muted"').as('mutedIndicator');
});

Cypress.Commands.add('unmutedIndicator', () => {
  return cy.get('[class*="bmpui-unmuted"').as('unmutedIndicator');
});

Cypress.Commands.add('bufferingOverlay', () => {
  return cy.get('[class*="bmpui-ui-buffering-overlay"]', { timeout: 20000 }).as('bufferingOverlay');
});