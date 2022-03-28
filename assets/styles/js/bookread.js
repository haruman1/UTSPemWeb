var myState = {
  pdf: null,
  currentPage: 1,
  zoom: 1,
};

//get pdf file
pdfjsLib.getDocument('/assets/pdf/Catcher%20in%20the%20Rye.pdf').then((pdf) => {
  myState.pdf = pdf;
  render();
});
//pdf page previous & next function
document.getElementById('go_previous').addEventListener('click', (e) => {
  if (myState.pdf == null || myState.currentPage == 1) return;
  myState.currentPage -= 1;
  document.getElementById('current_page').value = myState.currentPage;
  render();
});
document.getElementById('go_next').addEventListener('click', (e) => {
  if (
    myState.pdf == null ||
    myState.currentPage > myState.pdf._pdfInfo.numPages
  )
    return;
  myState.currentPage += 1;
  document.getElementById('current_page').value = myState.currentPage;
  render();
});

//current page function
document.getElementById('current_page').addEventListener('keypress', (e) => {
  if (myState.pdf == null) return;
  var code = e.keyCode ? e.keyCode : e.which;
  if (code == 13) {
    var desiredPage = document.getElementById('current_page').valueAsNumber;
    if (desiredPage >= 1 && desiredPage <= myState.pdf._pdfInfo.numPages) {
      myState.currentPage = desiredPage;
      document.getElementById('current_page').value = desiredPage;
      render();
    }
  }
});

// zoom in & out function
document.getElementById('zoom_in').addEventListener('click', (e) => {
  if (myState.pdf == null) return;
  myState.zoom += 0.5;
  render();
});
document.getElementById('zoom_out').addEventListener('click', (e) => {
  if (myState.pdf == null) return;
  myState.zoom -= 0.5;
  render();
});

// pdf file render function
function render() {
  myState.pdf.getPage(myState.currentPage).then((page) => {
    var canvas = document.getElementById('pdf_renderer');
    var ctx = canvas.getContext('2d');
    var viewport = page.getViewport(myState.zoom);
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    page.render({
      canvasContext: ctx,
      viewport: viewport,
    });
  });
}
function showqr() {
  const qrcode = new QRCode(document.getElementById('qrcode'), {
    text: 'http://localhost/readbook.php?id=1',
    width: 128,
    height: 128,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H,
  });
}
const qrcode = document.getElementById('qrcode');
const textInput = document.getElementById('qrcodes');
const neqr = new QRCode(qrcode);
neqr.makeCode(textInput.value.trim());
textInput.oninput = (e) => {
  neqr.makeCode(textInput.value.trim());
};
