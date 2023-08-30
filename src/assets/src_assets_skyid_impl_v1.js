/* eslint-disable */
import * as skyid from 'skyid-sdk-web'
import $ from 'jquery';


// =====================================================================================
// | SkyID Web SDK Editable Variable (pameters, messages, activation server, warnings) |
// =====================================================================================

// remote params
var skyid_fa_sdk_params_url="https://saas.ms.sup1.idc.skyidentification.com:7008/";
var skyid_fa_frame_check_api = "https://saas.ms.sup1.idc.skyidentification.com:4432/";
var skyid_fa_sdk_user = "damanesign.skyid";//"tls.contact";
var skyid_fa_sdk_password = "40Kwvx*K003M";//"tls123!";
// SDK initialization
const skyid_fa_sdk_token = '040118867288085084405601345312209';
const skyid_fa_sdk_appId = 'damanesign.saas.web.skyid.idc';

// skyid face analysis variable
var canvas_selfie=null;
var canvas_document_photo=null;
var skyid_fa_init_error_callback
var statuss
function setVariables(){
    skyid.message_variables.skyid_fa_sdk_access_error_message="Votre token n'est pas valide";
    skyid.message_variables.skyid_fa_sdk_loading_error_message="Error lors de chargement des modules";
    skyid.message_variables.skyid_fa_sdk_network_error_message="Error de connexion au serveur, merci de verifier votre connexion internet";
    skyid.message_variables.skyid_fa_sdk_camera_error_message="Impossible de demmarer votre camera, merci de verifier que votre camera et bien actif";
    skyid.message_variables.skyid_fa_face_start_message="SVP positionner votre visage au centre sans rotation. puis clique sur start.";
    skyid.message_variables.skyid_fa_face_loading_message="Chargement des modules, Patietez SVP.";
    skyid.message_variables.skyid_fa_mul_face_warning_msg="SVP representer un seul visage devant le camera.";
}
setVariables()

function initViewComponent(){
    let skyid_liveness = document.getElementById('skyid_liveness');
    skyid_liveness.innerHTML = skyid.skyid_component;
    
}
function start_face_scan(){
    skyid.skyid_fa_start_face_scan(skyid_fa_face_scan_end_callback,process_spoof_timeOut);
}
// ************************************** SDK API init ****************************************
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
                              // *************************
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
// init SDK
async function toHelpAwait(){
    await skyid_fa_remote_sdk_initialization()
}
toHelpAwait()
// ************************************** END SDK init API definition *************************

// Web page is loaded
$( document ).ready(function() {
      $("#skyid_fa_document_container").show(500);

      $( "#skyid_da_smart_ocr_button" ).click(function() {
              skyid_fa_auth_request_smart_ocr();
              $("#skyid_da_smart_ocr_button").prop('disabled', true);
              $("#skyid_da_smart_ocr_button").html("extraction d'information en cours ...");
      });

      $( "#skyid_fa_next" ).click(function() {
        show_matching_step();
      });

      $( "#skyid_fa_start_button" ).click(function() {
				// start SDK face analysis
        skyid.skyid_fa_start_face_scan(skyid_fa_face_scan_end_callback, process_spoof_timeOut);
                     $( "#skyid_fa_start_button" ).hide();
                     $( "#msg" ).html("Scanne de visage en cours ....");
       });

});

// load and verify documents
function show_matching_step()
{
		$("#skyid_document_browser").hide(500);
		$("#liveness_frame").show( 500, function() {
			// SDK setup
			skyid.skyid_fa_setup_sdk();
		});
}

function show_skyid_smart_ocr_step()
{
		$("#doc_file_label").hide(500);
		$("#skyid_da_smart_ocr_button").show(500);
}

function process_doc_check_response(check_response)
{
	if(check_response==null)
	{
      alert("La photo dans le document n'est pas claire, Merci de charger un document avec une photo valide.");
	}
	else{
					canvas_document_photo=check_response;
					show_skyid_smart_ocr_step();
	}
	//$("body").append(check_response);
}

async function check_photo_in_document(image_object)
{
		let canvas_tmp = document.createElement("CANVAS");
		var ctx_tmp = canvas_tmp.getContext('2d');
		canvas_tmp.width  = image_object.naturalWidth;
		canvas_tmp.height = image_object.naturalHeight;
		ctx_tmp.drawImage(image_object, 0, 0);
		let photo_in_doc = await skyid.get_face_from_document(canvas_tmp);
		process_doc_check_response(photo_in_doc)
}


function readImage(file) {
	// Check if the file is an image.
	if (file.type && !file.type.startsWith('image/')) {
		alert("le fichier chargé n'est pas une image");
		return;
	}
	const doc_img = document.getElementById('doc_img');
	const reader = new FileReader();
	reader.addEventListener('load', (event) => {
			doc_img.src = event.target.result;
			doc_img.onload = function(){
					check_photo_in_document(doc_img);
			}

	});
	reader.readAsDataURL(file);
}










// SDK face analysis callback
function process_spoof_timeOut()
{
	console.log("the face is SPOOF");
     $( "#skyid_fa_start_button" ).html("Redémarrer");
	  $( "#skyid_fa_start_button" ).show();
    $( "#msg" ).html("Opération non réussie");
}


var canvas_selfie=null
function skyid_fa_face_scan_end_callback(skyid_fa_detected_face_canvas)
{
    canvas_selfie=skyid_fa_detected_face_canvas
    skyid_fa_check_liveness(skyid_fa_detected_face_canvas);
}




// DO Face Matching

function skyid_fa_base64ToArrayBuffer(base64) {
    const binary_string =  window.atob(base64);
    const len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function skyid_fa_canvas2binary(req_canvas)
{
    let skyid_fa_canvas_data = req_canvas.toDataURL('image/jpeg', 1.0);
    skyid_fa_canvas_data = skyid_fa_canvas_data.replace('data:image/jpeg;base64,', '');
    return skyid_fa_base64ToArrayBuffer(skyid_fa_canvas_data)
}


// ************************************** API LIVENESS CHECK API *************************

function skyid_fa_check_liveness_request(skyid_fa_auth,frame_canvas)
{
   //create binary image file
  const canvas_bin = skyid_fa_canvas2binary(frame_canvas);
  const  face_image= new File([canvas_bin], "skyid_fa_selected_frame.jpg",{type:"application/octet-stream"})
  // setup request parameters
  let form_data = new FormData();
  form_data.append("selfie",face_image);
  // send request
  $.ajax({
      url : skyid_fa_frame_check_api+"check_liveness",
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
                     skyid_fa_auth_request_face_matching(canvas_selfie,canvas_document_photo);
                     console.log("face detection success")
                }else{
                     alert("echec de verification preuve de vue, SVP reessayer dans un environement limunaux");
                }
                $( "#msg" ).html("Result :"+api_result["face_class"]+" score "+api_result["score"]+"<br/><br/>");
            }
            else{
                 alert("echec de verification preuve de vue, SVP reessayer dans un environement limunaux")
            }

          	  $( "#skyid_fa_start_button" ).html("Redemarrer");
              $( "#skyid_fa_start_button" ).show();

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

// ********************************** END API LIVENESS CHECK API *************************



function skyid_fa_doc_face_matching_request(access_token, selfie, doc_photo)
{
	    const id_customer = "000012354"
        const my_guide= "skyidWeb_tlscontact_"+id_customer+"_"+Date.now();
        if (selfie != null && doc_photo!=null)
				{
					      const selfie_bin = skyid_fa_canvas2binary(selfie);
                const doc_photo_bin = skyid_fa_canvas2binary(doc_photo);

					      const selfie_file = new File([selfie_bin], "selfie.jpg",{type:"application/octet-stream"});
								const doc_photo_file = new File([doc_photo_bin], "doc_photo.jpg",{type:"application/octet-stream"});

								var form = new FormData();
								form.append("guid", my_guide);
								form.append("token", skyid_fa_sdk_token);
								form.append("application_id", skyid_fa_sdk_appId);
								form.append("doc_1_1", doc_photo_file);
								form.append("slf_1_1", selfie_file);

								var settings = {
								  "url": "https://saas.ms.sup1.idc.skyidentification.com:7008/compare_multi_doc_vs_selfie",
								  "method": "POST",
                  "headers" : {"Authorization":"Bearer "+access_token},
								  "processData": false,
								  "cache" : false,
								  "contentType": false,
								  "data": form,
									success : function(response) {
										if(response["status_code"]=="000")
										{
											if (response['sky_face_match_decision_code']==1)
											{
												 $( "#msg" ).html("Vérification d'identité réussie"+"<br/><br/>");
											}else{
												$( "#msg" ).html("Vérification d'identité échouée"+"<br/><br/>");
											}
										}else{
											$( "#msg" ).html(""+"<br/><br/>");
											alert("Une erreur est survenue lors de la vérification d'identité, réessayer svp.")
										}


									},
									error: function(xhr, status, error) {
										$( "#msg" ).html(""+"<br/><br/>");
										alert("Erreur serveur : "+xhr.status+" : "+xhr.statusText);
									}
								};

								$.ajax(settings);
			}else {
				alert("Images introuvables")
			}

}

function skyid_fa_auth_request_face_matching(selfie_, doc_photo_)
{
  var form = new FormData();
  form.append("username", skyid_fa_sdk_user);
  form.append("password", skyid_fa_sdk_password);

  $.ajax({
      url : "https://saas.ms.sup1.idc.skyidentification.com:7008/login",
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
              skyid_fa_doc_face_matching_request(temp_token, selfie_, doc_photo_)
          }else
          {
              alert("999 - "+response["status_label"]);
          }
      },
      error: function(xhr, status, error) {
          alert("Erreur serveur : "+xhr.status+" : "+xhr.statusText);
      }
    });
}

//  SkyID Smart OCR api

function compressImage()
{
	var sky_source_image = document.getElementById('doc_img');
	if (sky_source_image.src == "") {
		alert("Aucune image scanner est trouvé !!");
	return "0";
	}

	var quality = 80;
	// let compressed = jic.compress(sky_source_image,quality,"jpeg").src;
	return sky_source_image.src
	

}

function skyid_extract_info_from_doc_request(access_token){
  	var compressed_image=compressImage();
  	compressed_image = compressed_image.replace('data:image/jpeg;base64,', '');
  	var binary_data=skyid_fa_base64ToArrayBuffer(compressed_image)
  	var myImage= new File([binary_data], "byts_document.jpg",{type:"application/octet-stream"})
  	var form_data = new FormData();
  	form_data.append("document",myImage);
  	form_data.append('institution_id',"032");
  	form_data.append('application_id',skyid_fa_sdk_appId);
  	form_data.append('channel_id',"02");
  	form_data.append('service_id',"01");
  	form_data.append('sub_service_id',"0005");
  	form_data.append('token',skyid_fa_sdk_token);
  	form_data.append("request_data",'{"doc_type":"01"}');
  	$.ajax({
  		  url : "https://saas.ms.sup1.idc.skyidentification.com:7001/extract_info_from_document",
  		  type : "POST",
        headers : {"Authorization":"Bearer "+access_token},
        crossDomain: true,
  		  data : form_data,
  		  cache : false,
  		  contentType : false,
  		  processData : false,
  		  success : function(fields_data) {
        statuss=fields_data["status_code"]
  			if(statuss=="000")
  			{
          const content=fields_data["response_data"]
  				for (let field in content)
  				{
  					$("#extracted_feilds").append("<label for=\""+field+"\">"+field+" : </label> <input type=\"text\" id=\""+field+"\" name=\""+field+"\" value=\""+content[field]+"\"\"><br>")
  				}
          $( "#doc_img" ).hide(500);
          $( "#skyid_da_smart_ocr_button" ).hide(500);
          $( "#skyid_fa_next" ).show(500);
          $( "#extracted_feilds" ).show(500);
        }else{
          alert("document analysis alert, status_code "+statuss+" : "+fields_data["status_label"])
        }

  		  },
  		  error: function(xhr, statuss, error) {
          alert("Erreur serveur : "+xhr.status+" : "+xhr.statusText);
        }
  		});
}

function skyid_fa_auth_request_smart_ocr()
{
  var form = new FormData();
  form.append("username", skyid_fa_sdk_user);
  form.append("password", skyid_fa_sdk_password);

  $.ajax({
      url : "https://saas.ms.sup1.idc.skyidentification.com:7001/login",
      type : "POST",
      crossDomain: true,
      data : form,
      cache : false,
      contentType : false,
      processData : false,
      success : function(response) {
          if(response["status_code"]=="000")
          {
              const skyid_fa_setup_data=response["response_data"];
              const temp_token = skyid_fa_setup_data["access_token"]
              skyid_extract_info_from_doc_request(temp_token)
          }else
          {
              alert("999 - "+response["status_label"]);
          }
      },
      error: function(xhr, status, error) {
          alert("Erreur serveur : "+xhr.status+" : "+xhr.statusText);
      }
    });
}


// ************************************** DATA RECOVER API *******************************

function skyid_smart_ocr_rocover_request(access_token,p_document_uniquenqme)
{
  	var form_data = new FormData();
    form_data.append('application_id',skyid_fa_sdk_appId);
    form_data.append('token',skyid_fa_sdk_token);
    form_data.append("document_uniqueName", p_document_uniquenqme);

    $.ajax({
      		    url : "https://saas.ms.sup1.idc.skyidentification.com:7001/skyid_ocr_status",
      		    type : "POST",
                headers : {"Authorization":"Bearer "+access_token},
                crossDomain: true,
                data : form_data,
                cache : false,
                contentType : false,
                processData : false,
      		    success : function(fields_data) {
                    console.log(fields_data);
      		    },
                error: function(xhr, status, error) {
                  alert("Erreur serveur : "+xhr.status+" : "+xhr.statusText);
                }
      		});
}

function skyid_fa_auth_request_smart_ocr_recover(p_registred_uniquename)
{
  var form = new FormData();
  form.append("username", skyid_fa_sdk_user);
  form.append("password", skyid_fa_sdk_password);

  $.ajax({
      url : "https://saas.ms.sup1.idc.skyidentification.com:7001/login",
      type : "POST",
      crossDomain: true,
      data : form,
      cache : false,
      contentType : false,
      processData : false,
      success : function(response) {
          if(response["status_code"]=="000")
          {
              const skyid_fa_setup_data=response["response_data"];
              const temp_token = skyid_fa_setup_data["access_token"]
              skyid_smart_ocr_rocover_request(temp_token,p_registred_uniquename)
          }else
          {
              alert("999 - "+response["status_label"]);
          }
      },
      error: function(xhr, status, error) {
          alert("Erreur serveur : "+xhr.status+" : "+xhr.statusText);
      }
    });
}
// demo call
skyid_fa_auth_request_smart_ocr_recover("1671122267893033679")
// ************************************** END DATA RECOVER API ***************************
export{skyid_fa_remote_sdk_initialization,skyid_fa_auth_request_smart_ocr,show_matching_step,
    skyid_fa_face_scan_end_callback,process_spoof_timeOut,skyid_fa_auth_request_smart_ocr_recover,readImage
    ,initViewComponent,start_face_scan
}