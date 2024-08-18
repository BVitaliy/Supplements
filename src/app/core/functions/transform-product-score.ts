export function transformProductScore(product_score: Array<number>) {
  if (product_score.length === 1) {
    if (product_score.includes(1)) {
      product_score = [0, 2];
    } else if (product_score.includes(2)) {
      product_score = [2, 4];
    } else if (product_score.includes(3)) {
      product_score = [4, 5];
    }
  } else if (product_score.length === 2) {
    if (product_score.includes(1) && product_score.includes(2)) {
      product_score = [0, 4];
    } else if (product_score.includes(1) && product_score.includes(3)) {
      product_score = [0, 5];
    } else if (product_score.includes(2) && product_score.includes(3)) {
      product_score = [2, 5];
    }
  } else if (
    product_score.length === 3 &&
    product_score.includes(1) &&
    product_score.includes(2) &&
    product_score.includes(3)
  ) {
    product_score = [0, 5];
  }

  return product_score;
}
