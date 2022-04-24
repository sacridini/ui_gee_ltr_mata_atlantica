var palettes = require('users/gena/packages:palettes');
// var palette = palettes.misc.tol_rainbow[7];
var palette = palettes.colorbrewer.YlOrRd[9];
var vis = {min: 0, max: 1000, palette: palette};

// Create a panel with vertical flow layout.
var panel = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical'),
  style: {width: '500px'}
});

var title = ui.Label({
  value: 'Long-term analysis (1985 – 2018) of forest changes in Atlantic Forest using the Landtrendr algorithm',
  style: {'fontSize': '24px'}
});
panel.add(title)

var msg = ['Analysis of all Atlantic Forest between 1985 and 2018 using the Landtrendr algorithm.',
           'The algorithm was run using default parameters for loss and also for gain scenarios.',
           'The results were post-processed and for the loss scenario, and also divided between quick and slow changes.'].join('\r\n');
var intro = ui.Label(msg);
panel.add(intro)

// All loss events - label + button
var load_loss_all_label = ui.Label("1. Map of all loss events (1985 - 2018)");
panel.add(load_loss_all_label)
var loss_all_button = ui.Button({label: 'Load Loss Events (All)', style: {stretch: 'horizontal'}})
panel.add(loss_all_button);

// Loss events with dur > 1 - label + button
var load_loss_dur_neq1_label = ui.Label("2. Map of loss events with duration greater then 1 (1985 - 2018)");
panel.add(load_loss_dur_neq1_label)
var load_loss_dur_neq1_button = ui.Button({label: 'Load Loss Events (Duration > 1)', style: {stretch: 'horizontal'}})
panel.add(load_loss_dur_neq1_button);

// Loss events with dur = 1 - label + button
var load_loss_dur_eq1_label = ui.Label("3. Map of loss events with duration equal to 1 (1985 - 2018)");
panel.add(load_loss_dur_eq1_label)
var load_loss_dur_eq1_button = ui.Button({label: 'Load Loss Events (Duration = 1)', style: {stretch: 'horizontal'}})
panel.add(load_loss_dur_eq1_button);

// All gain events - label + button
var load_gain_all_label = ui.Label("4. Map of all gain events (1985 - 2018)");
panel.add(load_gain_all_label)
var gain_all_button = ui.Button({label: 'Load Gain Events', style: {stretch: 'horizontal'}})
panel.add(gain_all_button);

// Function to create a legend as a thumbnail inserted to the UI panel
function makeLegend(elev) {
  var lon = ee.Image.pixelLonLat().select('longitude');
  var gradient = lon.multiply((elev.max-elev.min)/100.0).add(elev.min);
  var legendImage = gradient.visualize(elev);
  var panel = ui.Panel({
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {
          position: 'bottom-right',
          padding: '5x 5px',
          color: '000000'
    },

    widgets: [
      ui.Label(String(elev.min)), 
      ui.Label({style: {stretch: 'horizontal'}}),
      ui.Label(String(250)), 
      ui.Label({style: {stretch: 'horizontal'}}),
      ui.Label(String(500)),
      ui.Label({style: {stretch: 'horizontal'}}),
      ui.Label(String(750)), 
      ui.Label({style: {stretch: 'horizontal'}}),
      ui.Label(elev.max)
    ]
  });
  
  // Create legend title //
  var legendTitle = ui.Label({
    value: 'Magnitude',
    style: {
      stretch: 'horizontal',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '14px',
    }
  });

  var thumb = ui.Thumbnail({
    image: legendImage, 
    params: {bbox:'0,10,100,8', dimensions:'356x15'}, 
    style: {padding: '0.5px'}
  });

  return ui.Panel({style:{position: 'bottom-right'}}).add(legendTitle).add(thumb).add(panel);
}

// Load functions
var load_loss_all = function() {
  Map.clear();
  Map.add(makeLegend(vis));
  var image_temp = ee.Image('users/elacerda/ltr_ma/loss_masked85_maskedGain');
  Map.setCenter(-43.1542, -22.8545, 11)
  Map.addLayer(image_temp, vis, 'Load Loss Events (All)')
}
loss_all_button.onClick(load_loss_all);

var load_loss_all_dur_neq1 = function() {
  Map.clear();
  Map.add(makeLegend(vis));
  var image_temp = ee.Image('users/elacerda/ltr_ma/loss_masked85_maskedGain_dur_neq1');
  image_temp = image_temp.updateMask(image_temp.neq(0));
  Map.setCenter(-43.1542, -22.8545, 11)
  Map.addLayer(image_temp, vis, 'Load Loss Events (Duration > 1)')
}
load_loss_dur_neq1_button.onClick(load_loss_all_dur_neq1);

var load_loss_all_dur_eq1 = function() {
  Map.clear();
  Map.add(makeLegend(vis));
  var image_temp = ee.Image('users/elacerda/ltr_ma/loss_masked85_maskedGain_dur_eq1');
  image_temp = image_temp.updateMask(image_temp.neq(0));
  Map.setCenter(-43.1542, -22.8545, 11)
  Map.addLayer(image_temp, vis, 'Load Loss Events (Duration = 1)')
}
load_loss_dur_eq1_button.onClick(load_loss_all_dur_eq1);

var load_gain_all = function() {
  Map.clear();
  Map.add(makeLegend(vis));
  var image_temp = ee.Image('users/elacerda/ltr_ma/gain_seg6_masked18_dur_gt4_inv_for');
  Map.setCenter(-43.1542, -22.8545, 11)
  Map.addLayer(image_temp, vis, 'Load Gain Events')
}
gain_all_button.onClick(load_gain_all);

// Initialization
ui.root.add(panel);