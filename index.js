'use strict';

// const canvas = document.getElementById('graph');
// const ctx = canvas.getContext('2d');

const MATRIX = [
  [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 1, 0, 0, 0, 0, 0, 0, 1, 0, 0 ],
  [ 1, 0, 1, 0, 0, 0, 0, 0, 0, 0 ],
  [ 1, 0, 0, 1, 1, 0, 0, 1, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 1, 0, 1, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 ]
];
let N = MATRIX.length;

class SimpleWay {
  constructor ( from, to ) {
    this.from = from;
    this.to = to;
  }
}

class Path {
  constructor ( ways ) {
    this.ways = ways;
  }

  get route() {
    let key = `${ +this.ways[0].from + 1 } - `;
    for ( const i in this.ways ) {
      key += +this.ways[i].to + 1;
      if ( +i !== ( this.ways.length - 1 ) ) { 
        key += ' - ';
      }
    }
    return key;
  }
}

const compareArrs = ( arr1, arr2 ) => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

const compareWays = ( way1, way2 ) => {
  const arr1 = [ way1.to, way1.from ];
  const arr2 = [ way2.to, way2.from ];
  return compareArrs( arr1, arr2 );
}

const allPosWays = ( matrix ) => {
  let arr = [];
  for ( const row in matrix) {
    for ( const ind in matrix[row] ) {
      if ( matrix[row][ind] ) {
        const way = new SimpleWay ( row, ind );
        arr.push(way);
      }
    }
  }
  return arr;
}

const hasWay = ( arr, way ) => {
  for ( const anotherWay of arr ) {
    if (compareWays( anotherWay, way )) return true;
  }
  return false;
}

const findPaths = ( ways, length ) => {
  let paths = initiatePaths( ways );
  for ( let i = 1; i < length; i++ ) {
    let copy = paths;
    paths = [];
    for ( const path of copy ) {
      let nextPeaks = findNextPeaks( path, ways );
      for ( const peak of nextPeaks ) {
        paths.push(new Path( [...path.ways, peak] ));
      }
    }
  }
  return paths;
}

//returns array with paths which length = 1
const initiatePaths = ways => {
  const paths = [];
  for (const way of ways ) {
    paths.push( new Path( [way] ) );
  }
  return paths;
}

//returns available peaks
const findNextPeaks = ( path, ways ) => {
  let nextPeaks = [];
  let route = path.ways;
  for ( const way of ways ) {
    if ( !hasWay( route, way ) && lastEqualThat( route, way ) ) {
      nextPeaks.push(way);
    }
  }
  return nextPeaks;
}

const lastEqualThat = ( last, that ) => {
  if ( last[ last.length - 1 ].to === that.from ) return true;
  else return false;
}

const createList = ( paths, divElem ) => {
  let div = document.querySelector(divElem);
  for ( let path of paths ) {
    let p = document.createElement("p");
    let text = document.createTextNode(path.route);
    p.appendChild(text);
    div.appendChild(p);
  }
}

const multiplyMatrix = ( matrix1, matrix2 ) => { 
  const rows1 = matrix1.length; 
  const cols1 = matrix1[0].length;
  const rows2 = matrix2.length;
  const cols2 = matrix2[0].length;
  let result = [];
  if (cols1 !== rows2) return false;
  for (let i = 0; i < rows1; i++) result[ i ] = [];
  for (let k = 0; k < cols2; k++) {
    for (let i = 0; i < rows1; i++) {
      let t = 0;
      for (let j = 0; j < rows2; j++) t += matrix1[ i ][j] * matrix2[j][k];
      result[i][k] = t;
    }
  }
  return result;
}

const addMatrix = ( matrix1, matrix2 ) => {
  let result = [];
  for ( let i = 0; i < matrix1.length; i++ ) {
    result.push(new Array(null));
    for (let j = 0; j < matrix2.length; j++ ) {
      result[i][j] = matrix1[i][j] + matrix2[i][j];
    }
  }
  return result;
}

const generateUnitMatrix = ( length ) => {
  let I = [];
  for ( let i = 0; i < length; i++ ) {
    I.push(new Array(null));
    for ( let j = 0; j < length; j++ ) {
      if ( j === i ) I[i][j] = 1;
      else I[i][j] = 0;
    }
  }
  return I;
}

const transformToBool = matrix => {
  for ( let i = 0; i < matrix.length; i++ ) {
    for ( let j = 0; j < matrix.length; j++ ) {
      if ( matrix[i][j] !== 0 ) {
        matrix[i][j] = 1;
      }
    }
  }
  return matrix;
}

const reachableMatrix = matrix => {
  let length = matrix.length;
  let I = generateUnitMatrix( length );
  let temp = matrix;
  let arr = [];
  let result = matrix;
  for ( let i = 0; i < length - 1; i++ ) {
    arr.push(temp);
    temp = multiplyMatrix( temp, matrix );
  }
  for ( let i = 1; i < arr.length; i++ ) {
    result = addMatrix( result, arr[i] );
  }
  return transformToBool( addMatrix( result, I ) );
}

const transformMatrix = matrix => {
  let m = matrix.length;
  let n = matrix[0].length;
  let result = [];
  for (let i = 0; i < n; i++) {
    result[i] = [];
    for (let j = 0; j < m; j++) result[i][j] = matrix[j][i];
  }
  return result;
}

const eachElementMult = ( matrix1, matrix2 ) => {
  let result = [];
  for ( let i in matrix1 ) {
    result[i] = [];
    for ( let j in matrix1[i] ) {
      result[i][j] = matrix1[i][j] * matrix2[i][j];
    }
  }
  return result;
}

const displayMatrix = ( matrix, divElem ) => {
  let div = document.querySelector(divElem);
  for ( let arr of matrix ) {
    let p = document.createElement("p");
    let text = document.createTextNode(arr);
    p.appendChild(text);
    div.appendChild(p);
  }
}

class strongComponent {
  constructor ( example, prots ) {
    this.example = example;
    this.prots = prots;
  }
}

const defineStrngComp = matrix => {
  matrix = transformMatrix( matrix );
  let components = [];
  components.push( new strongComponent( matrix[0], [0] ) );
  label: for ( let arrInd = 1; arrInd < matrix.length; arrInd++ ) {
    for (let compInd in components ) {
      if ( compareArrs( matrix[arrInd], components[compInd].example ) ) {
        components[compInd].prots.push( +arrInd );
        continue label;
      }
    }
    components.push( new strongComponent( matrix[arrInd], +arrInd ) );
  }
  return components;
}

const ways = allPosWays( MATRIX );

let paths2 = findPaths( ways, 2 );
let paths3 = findPaths( ways, 3 );

createList( paths2, "div.scrolling2" );
createList( paths3, "div.scrolling3" );

const reachMtrx = reachableMatrix( MATRIX );
const strongConnectivity = eachElementMult( reachMtrx, transformMatrix(reachMtrx));

displayMatrix( strongConnectivity, "div.strongMtrx" );

const strongComps = defineStrngComp( strongConnectivity );
console.log(strongComps);
