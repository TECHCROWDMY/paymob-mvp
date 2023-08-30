import * as skyid from '[skyid web SDK].js' // SDK import

  // inject SDK component in  HTML code
  let skyid_liveness = document.getElementById('skyid_liveness'); // skyid_liveness a div id in the html code. 
  skyid_liveness.innerHTML = skyid.skyid_component;
  
  // SDK initialization
  const skyid_fa_sdk_token = '##########################';
  const skyid_fa_sdk_appId = 'AAAAAAAAAAAAAA';
  
  // ************************************** SDK API init parameters ****************************************
  async function skyid_fa_get_params_request(skyid_fa_auth)
  {
         // setup request parameters
         let form_data = new FormData();
         form_data.append("token",skyid_fa_sdk_token);
         form_data.append("application_id",skyid_fa_sdk_appId);
         // send request
         $.ajax({
             url : skyid_fa_sdk_params_url+"get_parameters_web_sdk",
             type : "POST",
             headers : {"Authorization":"Bearer "+skyid_fa_auth},
             data : form_data,
             cache : false,
             contentType : false,
             processData : false,
             success : function(response) {
                            if(response["status_code"]=="000")
                            {
                                const sdk_data=response["response_data"];
                                // skyid sdk methods call
                                skyid.skyid_fa_init_sdk(sdk_data);
                            }else
                            {
                                alert(response["status_label"]);
                            }
             },
             error: function(xhr, status, error) {
                 alert(xhr.status+" : "+xhr.statusText);
             }
           });
           // end request
  
  }
  
  // get the dynamic token using your username and password
  async function skyid_fa_remote_sdk_initialization()
  {
    var form = new FormData();
    form.append("username", skyid_fa_sdk_user);
    form.append("password", skyid_fa_sdk_password);
  
    $.ajax({
        url : skyid_fa_sdk_params_url+"login",
        type : "POST",
        data : form,
        cache : false,
        contentType : false,
        processData : false,
        success : function(response) {
            if(response["status_code"]=="000")
            {
                const skyid_fa_setup_data=response["response_data"];
                const temp_token = skyid_fa_setup_data["access_token"]
                // call get parameters api with the obtained token
                skyid_fa_get_params_request(temp_token);
            }else
            {
                alert(skyid_fa_init_error_callback);
            }
        },
        error: function(xhr, status, error) {
            alert(xhr.status+" : "+xhr.statusText);
        }
      });
  }
  // init SDK with the defined method
  await skyid_fa_remote_sdk_initialization()
  
  // SDK setup
  await skyid.skyid_fa_setup_sdk();
  
  // Run Skyid face analysis and return a valide frontal face image
  
  var my_selfie_canvas = null;
  function process_fa_timeOut() {.....show message or retry......}
  
  skyid.skyid_fa_start_face_scan(skyid_fa_face_scan_end_callback, process_fa_timeOut);
  
  // definition of liveness check API Call
  
  // ************************************** API LIVENESS CHECK API *************************
  
  function skyid_fa_check_liveness_request(skyid_fa_auth,frame_canvas)
  {
     //create binary image file
    const canvas_bin = skyid_fa_canvas2binary(my_selfie_canvas); // see annexe
    const  face_image= new File([canvas_bin], "skyid_fa_selected_frame.jpg",{type:"application/octet-stream"})
    // setup request parameters
    let form_data = new FormData();
    form_data.append("guid",”you_kyc_id”);
    form_data.append("channel_id", “03”);
    form_data.append("selfie",face_image);
    // send request
    $.ajax({
        url : [skyid_fa_frame_check_api]+"check_liveness",
        type : "POST",
        headers : {"Authorization":"Bearer "+skyid_fa_auth},
        data : form_data,
        cache : false,
        contentType : false,
        processData : false,
        success : function(response) {
              if(response["status_code"]=="000")
              {
                  let api_result=response["response_data"]
                  if(api_result["face_class"]=="Real")
                  {
                       console.log("face liveness success")
                  }else{
                       alert("Liveness check failed, please try in luminante environment");
                  }
              }
              else{
                   alert("Liveness check failed, please try in luminante environment");
              }
        },
        error: function(xhr, status, error) {
            alert(xhr.status+" : "+xhr.statusText);
        }
      });
  }
  
  function skyid_fa_check_liveness(frame_canvas)
  {
    var form = new FormData();
    form.append("username", skyid_fa_sdk_user);
    form.append("password", skyid_fa_sdk_password);
  
    $.ajax({
        url : skyid_fa_frame_check_api+"login",
        type : "POST",
        data : form,
        cache : false,
        contentType : false,
        processData : false,
        success : function(response) {
            if(response["status_code"]=="000")
            {
                const skyid_fa_setup_data=response["response_data"];
                const temp_token = skyid_fa_setup_data["access_token"]
                skyid_fa_check_liveness_request(temp_token,frame_canvas);
            }else
            {
                alert(response["status_label"]);
            }
        },
        error: function(xhr, status, error) {
            alert(xhr.status+" : "+xhr.statusText);
        }
      });
  }
  
  function skyid_fa_face_scan_end_callback(skyid_fa_detected_face_canvas)
  {
      my_selfie_canvas=skyid_fa_detected_face_canvas
      skyid_fa_check_liveness(skyid_fa_detected_face_canvas);
  }
  
