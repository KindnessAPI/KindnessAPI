// import * as THREE from 'three'
// let InstancedBufferGeometry = THREE.InstancedBufferGeometry

// export default function InstancedPlaneBufferGeometry( width, height, widthSegments, heightSegments, stripNum ) {

// 	InstancedBufferGeometry.call( this );

// 	this.type = 'InstancedPlaneBufferGeometry';

// 	var WIDTH = widthSegments;
// 	var HEIGHT = heightSegments;

// 	var vertices = [];
// 	var infos = [];

// 	var p = 0;
//   for (var k = 0; k < stripNum; k++) {
//     for ( var i = 0; i < HEIGHT; i ++ ) {
//       for ( var j = 0; j < WIDTH; j ++ ) {
// 				vertices.push(Math.random(),Math.random(),Math.random());
// 				vertices.push(Math.random(),Math.random(),Math.random());
// 				vertices.push(Math.random(),Math.random(),Math.random());

// 				vertices.push(Math.random(),Math.random(),Math.random());
// 				vertices.push(Math.random(),Math.random(),Math.random());
// 				vertices.push(Math.random(),Math.random(),Math.random());
//       	p += 6;
// 			}
//     }
// 	}

// 	let pp = 0
// 	for (var k = 0; k < stripNum; k++) {
//     for ( var i = 0; i < HEIGHT; i ++ ) {
//       for ( var j = 0; j < WIDTH; j ++ ) {
// 				infos.push((pp + 0) / p, (pp + 1) / p, 0);
// 				infos.push((pp + 2) / p, (pp + 3) / p, 0);
// 				infos.push((pp + 4) / p, (pp + 5) / p, 0);
//       }
//     }
//   }

// 	this.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
// 	this.addAttribute( 'info', new THREE.Float32BufferAttribute( infos, 3 ) );

//   this.maxInstancedCount = stripNum

// 	let stripIDs = []
// 	for (var si = 0; si < stripNum; si++) {
// 		stripIDs.push(si, stripNum, si / stripNum)
// 	}
// 	this.addAttribute( 'stripID', new THREE.InstancedBufferAttribute( new Float32Array( stripIDs ), 3 ) );
// }

// InstancedPlaneBufferGeometry.prototype = Object.create( InstancedBufferGeometry.prototype );
// InstancedPlaneBufferGeometry.prototype.constructor = InstancedPlaneBufferGeometry;