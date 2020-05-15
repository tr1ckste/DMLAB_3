'use strict';

// const canvas = document.getElementById('graph');
// const ctx = canvas.getContext('2d');

const MATRIX = [
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 1, 0, 1, 1, 0, 0, 0, 1, 1]
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
    let key = `${+this.ways[0].from + 1} - `;
    for ( const i in this.ways ) {
      key += (+this.ways[i].to + 1).toString();
      if ( +i !== (this.ways.length - 1)) { 
        key += ' - ';
      }
    }
    return key;
  }
}

const compareWays = ( way1, way2 ) => {
  const arr1 = [ way1.to, way1.from ];
  const arr2 = [ way2.to, way2.from ];
  return ( JSON.stringify(arr1) === JSON.stringify(arr2));
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
  if ( length > 1 ) {
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

const ways = allPosWays(MATRIX);

let paths2 = findPaths( ways, 2 );
let paths3 = findPaths( ways, 3 );

createList( paths2, "div.prokrutka2" );
createList( paths3, "div.prokrutka3" );
