const fileInput = document.getElementById('fileInput');
const previewPlayer = document.getElementById('previewPlayer');
const previewSelectionButton = document.getElementById('previewSelection');
const selectNumeroInputs = [];
const saveButton = document.getElementById('SaveSend');
let selectedVideos = [];
let videos_final = [];
let aux_selectedVideos = [];

saveButton.disabled = true

const socket = io.connect('http://10.0.17.165');


fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    videoTableBody.innerHTML = '';
    selectedVideos = [];
    let variable = 0;
    saveButton.disabled = true

    Array.from(files).forEach((file, index) => {
        const videoUrl = URL.createObjectURL(file);
        const row = document.createElement('tr');
        const file_name = file.name

        const selectCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.index = index;
        selectCell.style.textAlign = "center";
        selectCell.style.borderBottom = "1px solid #ddd";
        selectCell.appendChild(checkbox);

        const nameCell = document.createElement('td');
        nameCell.classList.add("nombre_video");
        nameCell.textContent = file.name;
        nameCell.style.textAlign = "center";
        nameCell.style.borderBottom = "1px solid #ddd";

        const priorityCell = document.createElement('td');
        const p_select = document.createElement('select');
        p_select.classList.add("miVideo");
        p_select.disabled = true;
        const option = document.createElement('option');
        option.value = 0;
        option.textContent = "0";
        option.disabled = true;
        option.selected = true;
        p_select.appendChild(option);
        priorityCell.style.textAlign = "center";
        priorityCell.appendChild(p_select)
        priorityCell.style.borderBottom = "1px solid #ddd";

        row.appendChild(nameCell);
        row.appendChild(selectCell);
        row.appendChild(priorityCell)
        videoTableBody.appendChild(row);

        selectedVideos.push({ file, file_name, videoUrl });
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', event => {
          const row = event.target.closest('tr');
          const prioridad = row.querySelector('.miVideo')
          const selects_final = Array.from(document.querySelectorAll('.miVideo'))

          if (event.target.checked){
            prioridad.disabled = false;
            variable = variable +1;
            selects_final.forEach(select =>{
                const option = document.createElement('option');
                option.value = variable;
                option.textContent = variable;
                select.appendChild(option);
            })
          }else{
            prioridad.disabled = true;
            variable = variable -1;
            selects_final.forEach(select =>{
                const lastOption = select.options[select.options.length - 1];
                lastOption.remove();
            })           
            
          }
        
        });
      });
});

previewSelectionButton.addEventListener('click', () => {

    const selectedIndexes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => parseInt(checkbox.dataset.index));
    const selects_total = Array.from(document.querySelectorAll('.miVideo'));
    const enabledSelects = selects_total.filter(select => !select.disabled);
    let aux = [];
    let sort_videos = [];

    for (const select of enabledSelects) {

        const fila = select.closest('tr')
        const prioridad = fila.querySelector('.miVideo')
        const file_name = fila.querySelector('.nombre_video')

        if(prioridad.value == 0) {
            alert("Seleccione una prioridad diferente de 0")
            return
        }else if (aux.includes(prioridad.value)){
            alert("Dos videos no pueden tener la misma prioridad")
            return
        }else{

            aux.push(prioridad.value)

            for(const video of selectedVideos){
                if (file_name.innerHTML == video.file_name){
                    sort_videos[prioridad.value - 1] = video
                }
            }
        }
    }  

    videos_final = sort_videos.slice();

    previewPlayer.pause();
    previewPlayer.currentTime = 0;

    if (selectedIndexes.length > 0) {
        let currentIndex = 0;

        const playNextVideo = () => {
            if (currentIndex < sort_videos.length) {
                previewPlayer.src = sort_videos[currentIndex].videoUrl;
                previewPlayer.play();
                currentIndex++;
            } else {
                currentIndex = 0;
                playNextVideo();
            }
        };

        saveButton.disabled = false
        previewPlayer.onended = playNextVideo;
        playNextVideo()

    } else {
        alert('Selecciona al menos un video para previsualizar.');
    }
});

// saveButton.addEventListener('click', (event) => {
//     event.preventDefault();
//     const formData = new FormData();
    // for (let i = 0; i < videos_final.length; i++) {
    //     formData.append('videos[]', videos_final[i].file);
    // }

//     var totalSize = Array.from(videos_final).reduce((acc, file)=>acc+file.size, 0);
//     var totalUploaded = 0;

//     fetch('http://10.0.17.165/api/upload', {
//         method: 'POST',
//         body: formData,
//         onProgress: function(event){
//             console.log("Entrando a funcion onprogress")
//             if(event.lengthComputable){
//                 var percentComplete = (event.loaded / event.total)*100;
//                 console.log(percentComplete)
//             }
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         alert('Videos subidos exitosamente.');
//     })
//     .catch(error => {
//         console.error('Error al subir los videos:', error);
//     });
    
// })


saveButton.addEventListener('click', (event) => {
    event.preventDefault();
    const files = document.getElementById('fileInput').files;
    if (files.length === 0) {
        alert("Por favor selecciona al menos un archivo.");
        return;
    }

    const formData = new FormData();
    for (let i = 0; i < videos_final.length; i++) {
        formData.append('videos[]', videos_final[i].file);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://10.0.17.165/api/upload', true);

    xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            console.log(percentComplete)
            const progressBar = document.getElementById('progressBar');
            progressBar.style.width = (percentComplete + 10 ) + '%';
            progressBar.setAttribute('aria-valuenow', percentComplete);
            progressBar.textContent = Math.round(percentComplete) + '%';
        }
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById('status').textContent = 'Videos subidos exitosamente.';
            setTimeout(() => {
                progressBar.style.width = '0%';
                progressBar.setAttribute('aria-valuenow', 0);
                progressBar.textContent = '0%';
                document.getElementById('status').textContent = '';
            }, 3000); // Reiniciar después de 2 segundos
        } else {
            alert('Error al subir los videos.');
        }
    };

    xhr.onerror = function() {
        alert('Error en la solicitud de subida.');
    };

    xhr.send(formData);
});

