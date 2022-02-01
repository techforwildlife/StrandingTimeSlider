
$(document).ready(function() {
	
    			
		var ur = [16.339983, 75.536438]
			var ll = [14.731134, 72.364136]
			var bounds = L.latLngBounds(ll, ur);
    		var map = L.map('map', { 
			zoomControl: false,
    			center: [15.158,73.984 ],  
    			zoom: 9,	
    			minZoom: 4,
			touchzoom:false,
			scrollWheel: false,
			dragging: false,
			maxBounds: bounds

    		});
    	
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
		$.getJSON("https://raw.githubusercontent.com/techforwildlife/StrandingTimeSlider/main/StrandingMap.geojson", function(json) {
			var testlayer = L.geoJson(json,{

				// By default, Leaflet draws geojson points as simple markers
				// To alter this, the pointToLayer function needs to be used
				pointToLayer: function(feature, latlng) {
					return L.circleMarker(latlng, { // we use circle marker for the points
						fillColor: "#501e65",  // fill color of the circles
						color: '#501e65',      // border color of the circles
						weight: 0.7,             // circle line weight in pixels
						radius: 8,
						fillOpacity: 0.4     // fill opacity (0-1)
					}).on({
						  mouseover: function(e) {
							  this.openPopup();
							  this.setStyle({fillColor: 'green'});  // fill color turns green when mouseover
						  },
						  mouseout: function(e) {
							  this.closePopup();
							  this.setStyle({fillColor: '#501e65'});  // fill turns original color when mouseout
						  }
				  });
				}
			})//.addTo(map)
		
			
			testlayer.eachLayer(function(layer) {  // eachLayer() is an Leaflet function to iterate over the layers/points of the map

				var props = layer.feature.properties;   // attributes
				//var radius = calcPropRadius(props[timestamp]); // circle radius, calculation function defined below
				
				
				// pop-up information (when mouseover) for each city is also defined here
				var popupContent = "Location: "+props.Location+ "<br>"+ "Species: "+props.Species+ 
									"<br>"+"Status: "+ props.Stranding + "<br>"+"Count: "+ String(props.CarcassCo) + 
									"<br>"+ "Date: "+props.Date;
		  
				//layer.setRadius(radius);  // Leaflet method for setting the radius of a circle
				layer.bindPopup(popupContent, { autoClose: false }); // bind the popup content, with an offset
			});

				sliderControl = L.control.sliderControl({
					position: "topright",
					layer: testlayer
				});

				//For a Range-Slider use the range property:
				sliderControl = L.control.sliderControl({
					position: "topright",
					layer: testlayer, 
					timeAttribute: "time",
					isEpoch: false,
					//range: true,
					follow: true,
					sameDate: true,
					alwaysShowDate : true,
					rezoom: 10
				});
		
				//Make sure to add the slider to the map ;-)
				
				map.addControl(sliderControl);
				/*sliderControl.options.markers.sort(function(a, b) {
					return (a.feature.properties.Date> b.feature.properties.Date);
				});*/
				//And initialize the slider
				
				sliderControl.startSlider();
				$('#slider-timestamp').html(options.markers[ui.value].options.unique_time_values.substr(0, 19));
			});
			var baseLayers = {
				"Satellite":googleSat,
				"Google Map":googleStreets
				//"OpenStreetMap": osm
			};
			L.control.layers(baseLayers).addTo(map);
		});
		
	
