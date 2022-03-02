

$(document).ready(function() {
	
			var sliderControl = null;
			var ur = [16.339983, 75.536438]
			var ll = [14.731134, 72.364136]
			var bounds = L.latLngBounds(ll, ur);
    		var map = L.map('map', { 
				zoomControl: false,
    			center: [15.158,73.984 ],  
    			zoom: 9,	
    			minZoom: 7,
			maxZoom:11,
				touchzoom:false,
				scrollWheel: false,
				dragging: false,
				maxBounds: bounds

    		});
			var zoomHome = L.Control.zoomHome();
			zoomHome.addTo(map);
    		L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {             
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',  
				 subdomains: ['a','b','c']       }).addTo( map );

    			//'{s}.acetate.geoiq.com/tiles/acetate/{z}/{x}/{y}.png', {
    			//	attribution: 'Acetate tileset from GeoIQ' 
    			//}).addTo(map);	
				var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
					subdomains: 'abcd',
						maxZoom: 19
					});
					CartoDB_DarkMatter.addTo(map);
					
					// Google Map Layer
					
					googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
						maxZoom: 20,
						subdomains:['mt0','mt1','mt2','mt3']
					 });
					 googleStreets.addTo(map);
					
					 // Satelite Layer
					googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
					   maxZoom: 20,
					   subdomains:['mt0','mt1','mt2','mt3']
					 });
					googleSat.addTo(map);

					stamen_watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
					attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
					subdomains: 'abcd',
					maxZoom: 16,
					ext: 'jpg'
					}); 
					stamen_watercolor.addTo(map);
					
					var Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
					maxZoom: 16
					});
					Esri_NatGeoWorldMap.addTo(map)
    // Create additional Control placeholders
    function addControlPlaceholders(map) {
		var corners = map._controlCorners,
		  l = 'leaflet-',
		  container = map._controlContainer;
  
		function createCorner(vSide, hSide) {
		  var className = l + vSide + ' ' + l + hSide;
  
		  corners[vSide + hSide] = L.DomUtil.create('div', className, container);
		}
  
		//createCorner('verticalcenter', 'left');
		//createCorner('verticalcenter', 'right');
		createCorner('top', 'left');
		createCorner('top', 'right');
		createCorner('bottom', 'left');
		createCorner('bottom', 'right');
	
		createCorner('top', 'center');
		createCorner('middle', 'center');
		createCorner('middle', 'left');
		createCorner('middle', 'right');
		createCorner('bottom', 'center');
		createCorner('top','northwest')
		createCorner('bottom', 'southwest');
	  }
	  addControlPlaceholders(map);

	  var dolphin = L.icon({
		iconUrl: './img/turtle.svg',
		iconSize:     [38, 95], // size of the icon
		iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
		popupAnchor:  [-1, -76] // point from which the popup should open relative to the iconAnchor
	});
		$.getJSON("https://raw.githubusercontent.com/M-Sravanthi/StrandingTimeSlider/main/StrandingMap.geojson", function(json) {
			var testlayer = L.geoJson(json,{
				
				// By default, Leaflet draws geojson points as simple markers
				// To alter this, the pointToLayer function needs to be used
				pointToLayer: function(feature, latlng) {
					//return L.CircleMarker(latlng,{// we use circle marker for the points
					return L.marker(latlng, { 
						icon:dolphin, //remove this and unhash above to get circle markers
						fillColor: "#800000",  // fill color of the circles
						color: '#800000',      // border color of the circles
						weight: 0.7,             // circle line weight in pixels
						radius: 8,
						fillOpacity: 0.4     // fill opacity (0-1)
					}).on({
						  mouseover: function(e) {
							  this.openPopup();
							  this.setStyle({fillColor: '#FFFF00'});  // fill color turns green when mouseover
						  },
						  mouseout: function(e) {
							  this.closePopup();
							  this.setStyle({fillColor: '#800000'});  // fill turns original color when mouseout
						  }
				  });
				}
			})//.addTo(map)
		
			
			testlayer.eachLayer(function(layer) {  // eachLayer() is an Leaflet function to iterate over the layers/points of the map

				var props = layer.feature.properties;   // attributes
				// pop-up information (when mouseover) for each city is also defined here
				var popupContent = "Location: "+props.Location+ "<br>"+ "Species: "+props.Species+ 
									"<br>"+"Status: "+ props.Stranding + "<br>"+"Count: "+ String(props.CarcassCo) + 
									"<br>"+ "Date: "+props.Date;
		  
				//layer.setRadius(radius);  // Leaflet method for setting the radius of a circle
				layer.bindPopup(popupContent, { autoClose: false }); // bind the popup content, with an offset
				//layer.bindTooltip(props.Date, {permanently: true,offset: [0, 0]}).openTooltip()
			})

				//For a Range-Slider use the range property:
				sliderControl = L.control.sliderControl({
					position: "bottomsouthwest",
					layer: testlayer, 
					timeAttribute: "time",
					isEpoch: false,
					range: true,
					follow: false,
					//sameDate: true,
					//alwaysShowDate : true
					//rezoom: 14
				});
		
				
				map.addControl(sliderControl);
				sliderControl.startSlider();
				$('#slider-timestamp').html(options.markers[ui.value].options.time.substr(0, 19));
			})
			var baseLayers = {
				//"Satellite":googleSat,
				//"Google Map":googleStreets,
				"NatGeo": Esri_NatGeoWorldMap,
				"WaterColor":stamen_watercolor
				//"OpenStreetMap": osm
			};
			
			layerControl = L.control.layers(baseLayers, null,{position: 'topnorthwest'}).addTo(map);

			L.Control.textbox = L.Control.extend({
				onAdd: function(map) {
					
				var text = L.DomUtil.create('div','map-text');
				
				text.id = "info_text";
				text.innerHTML = "<strong>Stranding Map</strong>"
				return text;
				},
		
				onRemove: function(map) {
					// Nothing to do here
				}
			});
			L.control.textbox = function(opts) { return new L.Control.textbox(opts);}
			L.control.textbox({ position: 'middleleft' }).addTo(map);
		});
		
	

		
	
