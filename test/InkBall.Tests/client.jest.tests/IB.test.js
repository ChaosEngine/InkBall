/* eslint-disable no-console */
/*global describe,test,expect*/
import { InkBallGame } from "../../../src/InkBall.Module/IBwwwroot/js/inkball";

describe('InkBallGame tests', () => {

  test('inkball exists', () => {
    expect(InkBallGame).toBeTruthy();

    // const game = new InkBallGame();
    // console.log(game);

    // expect(game).toBeTruthy();
  });
});