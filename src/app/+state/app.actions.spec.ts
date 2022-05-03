import * as fromApp from './app.actions';

describe('aPPApps', () => {
  it('should return an action', () => {
    expect(fromApp.aPPApps().type).toBe('[App] APP Apps');
  });
});
