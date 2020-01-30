var flowAccumulation = ee.Image('WWF/HydroSHEDS/15ACC').select('b1');
var topography = ee.Image('CSP/ERGo/1_0/Global/ALOS_topoDiversity');

var alos = topography.select('constant');
var slope = ee.Terrain.slope(alos);
var slope = slope.select('slope').divide(0.01745);

// ----------------------------------------------------------------------------
var palettefac = ['000000', '023858', '006837', '1a9850', '66bd63', 'a6d96a', 'd9ef8b', 'ffffbf', 'fee08b', 'fdae61', 'f46d43', 'd73027'];
var flowAccumulationVis = {min: 0.0, max: 500.0, palette: palettefac};
var slopeVis = {min: 0.0, max: 100, palette: ['blue', 'green', 'red']};

Map.setCenter(-75.313, -12.724, 11);
Map.addLayer(slope, slopeVis, 'Slope');
Map.addLayer(flowAccumulation, flowAccumulationVis, 'FlowAccumulation');

// ----------------------------------------------------------------------------
// lsfactor_jiang
var flowacc_jiang = flowAccumulation.multiply(0.20).pow(0.28);
var slope_jiang = slope.multiply(0.10).pow(1.45);

var lsfactor_jiang = slope_jiang.multiply(flowacc_jiang).multiply(1.07);

Map.addLayer(lsfactor_jiang, {min: 0.0, max: 70.0, palette: palettefac}, 'lsfactor_jiang');
// ----------------------------------------------------------------------------
// lsfactor_arnoldus
// LS = ((Resol/22.1)^0.6)*((Slope1/9)^1.4)
var flowacc_arnoldus = (flowAccumulation.divide(22.1)).pow(0.6);
var slope_arnoldus = (slope.divide(9)).pow(1.4);

var lsfactor_arnoldus = slope_arnoldus.multiply(flowacc_arnoldus);
print(lsfactor_arnoldus);

Map.addLayer(lsfactor_arnoldus, {min: 0.0, max: 1, palette: palettefac}, 'lsfactor_arnoldus');
