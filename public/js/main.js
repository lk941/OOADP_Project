// Upload Poster JQuery
function posterChange(){
    console.log('posterChange function fired')
    let image = $("#posterUpload")[0].files[0];
    let formdata= new FormData();
    formdata.append('posterUpload', image);
    $.ajax({
        url: '/user/upload',
        type: 'POST',
        data: formdata,
        contentType: false,
        processData: false,
        'success':(data) =>{
            $('#poster').attr('src', data.file);
            $('#photoURL').attr('value', data.file); // sets posterURL hidden field
            if(data.err){
                $('#posterErr').show();
                $('#posterErr').text(data.err.message);
            } else{
                $('#posterErr').hide();
            }
        }
    });
};