//github_pagination npm package was not working as intended so I copied parsing function from github
export const parser = (linkStr) => {
  return linkStr.split(',').map(function(rel) {
    return rel.split(';').map(function(curr, idx) {
      if (idx === 0) return /[^_]page=(\d+)/.exec(curr)[1];
      if (idx === 1) return /rel="(.+)"/.exec(curr)[1];
    })
  }).reduce(function(obj, curr, i) {
    obj[curr[1]] = curr[0];
    return obj;
  }, {});
}

export const mergeArrays = (a, b) => {
  const result = Object.values(a.concat(b).reduce((a, e) => {
    a[e.id] = e;
    return a;
  }, {}));
  return result
}