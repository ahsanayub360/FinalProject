    var infowindow;
      function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          mapTypeControl: false,
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13
        });
// this is a function call , dont confuse with new , you can remove it , it wont affect functionality of function.
        new AutocompleteDirectionsHandler(map);
      }

       /**
        * @constructor
       */
      function AutocompleteDirectionsHandler(map) {
        this.map = map; // autocomplete is one of the functionality of map.
        this.originPlaceId = null;//we created oring place id 
        this.destinationPlaceId = null;//we created here destination place id
        this.travelMode = 'WALKING';// there are 3 types of mode. walking is one of them
        var originInput = document.getElementById('origin-input');// it will take the input from the origin input text box
        var destinationInput = document.getElementById('destination-input');//it will take the input from the destination input text box
        var modeSelector = document.getElementById('mode-selector');// it will take the input from the checkbox that we named as mode-selector
        this.directionsService = new google.maps.DirectionsService;//it will create obj of directionsServices.
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        //DirectionsService object communicates with the Google Maps API Directions Service
        // which receives direction requests and returns an efficient path. 
        //Travel time is the primary factor which is optimized, but other factors such as distance, 
        //number of turns and many more may be taken into account. 
        //You may either handle these directions results yourself or use the DirectionsRenderer object to render these results..
        this.directionsDisplay.setMap(map);
//below code will make a query/request to the google map and send the orgin input and destination where to reach. 
//we can do it two ways, either we can make by sending lat or lang or by using google.maps.places(parameters).
        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, {placeIdOnly: true});
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, {placeIdOnly: true});
//we will setup the click listener so that we can take the check box input of mode of walking.
//changemode-***** is ID in index.html of radio buttons from where we take the mode selector input.
        this.setupClickListener('changemode-walking', 'WALKING');
        this.setupClickListener('changemode-transit', 'TRANSIT');
        this.setupClickListener('changemode-driving', 'DRIVING');
//we send the id and mode to radio button prototype function  and also send value of input fields(input text boxes).
        //originAutocomplete are objects that have function of autocomplete!
        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        //destinationAutocomplete is object that have fucntion of autocomplete stored in it.

        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');


    }

      // Sets a listener on a radio button to change the filter type on Places
      // Autocomplete.
      AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
      //it will get the Id of radio button and store it in radio button
        var radioButton = document.getElementById(id);

        //we asign  this that has data related to map and its an object to a local variable.
        var me = this;
     //we added eventlistener on radio button here !!
        radioButton.addEventListener('click', function() {
        //me.travelMode means we are assigning travel mode to our already complie data about map.
        //we are storing our travel mode information in the obj that we will send to the google maps.
          me.travelMode = mode;
        //route here is also a function();
          me.route();
        });
      };

//we have setup the traveling mode and stored it in map obj. and we will come to the input fields
//we created a prototype of the method autocomplete direction handler and named it setupPlaceChangedListener.
//we passed this prototype function two parameters. their details are below!
      AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
        var me = this;
        //we named the variable orginautocomplete and destinationautocomplete as autocomplte.
        //now with this obj we will have aceess to the autocomplete properties.
        //and we are binding the view to model here. bindTo() is a MVC function that binds view to model

        autocomplete.bindTo('bounds', this.map);
        /*
         Programs interested in certain events will register JavaScript event listeners for those events 
         and execute code when those events are received by calling addListener() to register event handlers 
         on the object.*/
        autocomplete.addListener('place_changed', function() {
     //it will get the place from the input field and also it will get the place id. and other properties .
          var place = autocomplete.getPlace();
     //now it will check if the place id property is present in place obj.
          if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
          }

          if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
          } else {
            me.destinationPlaceId = place.place_id;
          }
    //now it will call the me.route() function.

          me.route();
        });

      };

//now lets see what the route function do when its call!
      AutocompleteDirectionsHandler.prototype.route = function() {
//if one of the input fields are empty then it wont execute.  It is the Id of the required place
        if (!this.originPlaceId || !this.destinationPlaceId) {
          return;
        }
        var me = this;
//route is a method of .route services. and it contains the origin and destination and travelMode.

          this.directionsService.route({
          origin: {'placeId': this.originPlaceId},
          destination: {'placeId': this.destinationPlaceId},
          travelMode: this.travelMode
        }, function(response, status) {
          if (status === 'OK') {
            //this will map the Google map with the new co-ordinates!!
            me.directionsDisplay.setDirections(response);
//now we use the response to access the values in lat and lang.
            document.getElementById('startlat').innerHTML = response.routes[0].legs[0].start_location.lat();
            document.getElementById('startlng').innerHTML = response.routes[0].legs[0].start_location.lng();
            document.getElementById('endlat').innerHTML = response.routes[0].legs[0].end_location.lat();
            document.getElementById('endlng').innerHTML = response.routes[0].legs[0].end_location.lng();
  
            
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      };