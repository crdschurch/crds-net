export class BitmovinPlayer {
  waitUntilBuffered() {
    return cy.get('[class*="bmpui-player-state-playing"]',{ timeout: 20000 })
      .find('[class*="bmpui-ui-buffering-overlay"]', { timeout: 20000 }).should('be.hidden');
  }

  verifySubtitlesNotDisplayed() {
    cy.get('[class*="bmpui-ui-subtitleselectbox"]').find('option[selected="selected"]').should('contain', 'off');
    cy.get('[class*="bmpui-ui-subtitle-overlay"]').find('span').should('not.exist');
  }

  verifySubtitlesDisplayed() {
    cy.get('[class*="bmpui-ui-subtitleselectbox"]').find('option').should('have.length.gte', 2);
    cy.get('[class*="bmpui-ui-subtitleselectbox"]').find('option[selected="selected"]').should('not.contain', 'off');
    cy.get('[class*="bmpui-ui-subtitle-overlay"]', { timeout: 20000 }).should('be.visible').find('span', { timeout: 60000 }).should('exist');
  }

  verifyPlayerMuted() {
    cy.get('[class*="bmpui-muted"').should('exist');
  }

  verifyPlayerNotMuted() {
    cy.get('[class*="bmpui-unmuted"').should('exist');
  }
}