export function transformProductScore(product_score: Array<any>) {
  if (product_score.length === 1) {
    if (product_score.includes(1)) {
      product_score = [0,3];
    } else if (product_score.includes(2)) {
      product_score = [4,7];
    } else if (product_score.includes(3)) {
      product_score = [8,10];
    }
  } else if (product_score.length === 2) {
    if (product_score.includes(1) && product_score.includes(2)) {
      product_score = [0,3,4,7];
    } else if (product_score.includes(1) && product_score.includes(3)) {
      product_score = [0,3,8,10];
    } else if (product_score.includes(2) && product_score.includes(3)) {
      product_score = [4,7,8,10];
    }
  } else if (
    product_score.length === 3 &&
    product_score.includes(1) &&
    product_score.includes(2) &&
    product_score.includes(3)
  ) {
    product_score = [0,3,4,7,8,10];
  }

  return product_score;
}
