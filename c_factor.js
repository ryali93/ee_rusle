// var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')
                  // .filterDate('2012-01-01', '2017-12-31').select('NDVI');
// print(dataset);
var dataset2 = ee.ImageCollection('LANDSAT/LT4_L1T_ANNUAL_NDVI').filterDate('1980-01-01', '1983-12-31');
print(dataset2);

var datasetview = dataset2.map(function(image){
  print(image);
  return image.clip(Jequetepeque)
});

var empty = ee.Image();

var colorizedVis = {
  min: 0.0,
  max: 1.0,
  palette: [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
    '012E01', '011D01', '011301'
  ],
};
var vizparams = {color: 'FF0000'}

var listOfImages = dataset2.toList(dataset2.size());
print(listOfImages);

var img1 =ee.Image(listOfImages.get(0));
var img2 = img1.clip(Jequetepeque)
print(img1);

// Map.setCenter(-78.8, -7.12, 10);
// Map.addLayer(dataset2, colorizedVis, 'Colorized');
Map.addLayer(Jequetepeque, vizparams, 'socota');
Map.addLayer(datasetview, colorizedVis, 'Colorized');
Map.centerObject(Jequetepeque);

var ndvi = ee.Image(dataset2.iterate(function(image, previous){
  var name = ee.String('NDVI_').cat(image.id());
  var ndvi = image.rename(name);
  return ee.Image(previous).addBands(ndvi);
},empty));

ndvi = ndvi.select(ndvi.bandNames().remove('constant'));

// ***********************
// Exportar imagen
Export.image.toDrive({

  image: ndvi,
  description: 'L4',
  scale: 250,
  region: Jequetepeque
});
