var sand = ee.Image("users/csaybar/RUSLE/SAND");
var silt = ee.Image("users/csaybar/RUSLE/SILT");
var clay = ee.Image("users/csaybar/RUSLE/CLAY");
var orgcar = ee.Image("users/csaybar/RUSLE/ORGCAR");
var flowAccumulation = ee.Image('WWF/HydroSHEDS/15ACC').select('b1');
  
var morg = orgcar.multiply(0.58);
var SN1 = sand.expression('1 - SAND / 100', {'SAND': sand.select('b1')});
var parameters = ee.Image().addBands([
  sand.select('b1'), 
  silt.select('b1'), 
  clay.select('b1'), 
  morg.select('b1'),
  SN1.select('constant'),
  orgcar.select('b1')]
);

var k_parameters = parameters.select(
    ['b1', 'b1_1', 'b1_2', 'b1_3', 'constant_1', 'b1_3'],     // old names
    ['sand', 'silt', 'clay', 'morg', 'sn1', 'orgcar']         // new names
);

var palette = [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
    '012E01', '011D01', '011301'
  ];
var colorized = {min: 0.0, max: 0.5, palette: palette};

var kfactor_williams = k_parameters.expression(
  '(0.2 + 0.3 * exp(-0.0256 * SAND * (1 - (SILT / 100)))) * (1 - (0.25 * CLAY / (CLAY + exp(3.72 - 2.95 * CLAY)))) * (1 - (0.7 * SN1 / (SN1 + exp(-5.51 + 22.9 * SN1))))',
  {
    'SAND': k_parameters.select('sand'),
    'SILT': k_parameters.select('silt'),
    'CLAY': k_parameters.select('clay'),
    'MORG': k_parameters.select('morg'),
    'SN1':  k_parameters.select('sn1'),
    'CORG': k_parameters.select('orgcar')
  });

var kfactor_zhu = k_parameters.expression(
  '(0.2 + 0.3 * exp(-0.0256 * SAND * (1 - (SILT / 100)))) * pow((SILT / (CLAY + SILT)),0.3) * (1 - (0.25 * (CORG / 10) / ((CORG / 10) + exp(3.72 - 2.95 * (CORG / 10) )))) * (1 - (0.7 * SN1 / (SN1 + exp(-5.51 + 22.9 * SN1))))',
  {
    'SAND': k_parameters.select('sand'),
    'SILT': k_parameters.select('silt'),
    'CLAY': k_parameters.select('clay'),
    'MORG': k_parameters.select('morg'),
    'SN1':  k_parameters.select('sn1'),
    'CORG': k_parameters.select('orgcar')
});

Map.setCenter(-78.8, -7.12, 6);
// Map.addLayer(kfactor_williams, colorized, 'kfactor_williams');
// Map.addLayer(kfactor_zhu, colorized, 'kfactor_zhu');

var kfactor = ee.Image().addBands([
  kfactor_williams.select('constant'), 
  kfactor_zhu.select('constant')
]);

print(kfactor);
var kfactor = kfactor.select(
    ['constant_1', 'constant_1_1'],     // old names
    ['williams', 'zhu']             // new names
);

var k = ee.ImageCollection([kfactor_williams, kfactor_zhu]);
print(k);
Map.addLayer(k);

// var palettefac = [
//     '000000', '023858', '006837', '1a9850', '66bd63', 'a6d96a', 'd9ef8b',
//     'ffffbf', 'fee08b', 'fdae61', 'f46d43', 'd73027'
//   ];
// var flowAccumulationVis = {min: 0.0, max: 500.0, palette: palettefac};
