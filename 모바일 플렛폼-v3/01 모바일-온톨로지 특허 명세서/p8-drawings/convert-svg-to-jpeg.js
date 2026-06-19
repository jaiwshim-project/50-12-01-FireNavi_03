const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgFiles = [
  'drawing-01-system_v2.svg',
  'drawing-02-trigger_v2.svg',
  'drawing-03-ontology_v2.svg',
  'drawing-04-riskmap_v2.svg',
  'drawing-05-routing_v2.svg',
  'drawing-06-matrix_v2.svg',
  'drawing-07-roles_v2.svg',
  'drawing-08-edge_v2.svg',
  'drawing-09-group_v1.svg',
  'drawing-10-ui_v1.svg',
  'drawing-11-compare_v1.svg',
  'drawing-12-scenario_v1.svg',
  'drawing-13-survey_v1.svg'
];

async function convertSvgToJpeg(svgPath) {
  const outputPath = svgPath.replace('.svg', '.jpg');

  try {
    await sharp(svgPath, { density: 300 })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 95, mozjpeg: true })
      .toFile(outputPath);

    console.log(`✅ ${path.basename(svgPath)} → ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ ${path.basename(svgPath)}: ${error.message}`);
  }
}

async function main() {
  console.log('SVG → JPEG 변환 시작...\n');

  for (const file of svgFiles) {
    await convertSvgToJpeg(file);
  }

  console.log('\n✅ 모든 변환 완료!');
}

main();
