// ============================================
// PDF GENERATOR - вся логика в одном объекте
// ============================================

const PDFGenerator = {
  selectedObjectId: null,

  // Открыть форму
  openForm: function () {
    if (!objectsData || objectsData.length === 0) {
      alert('Данные объектов не загружены');
      return;
    }

    // Заполняем select объектами
    const select = document.getElementById('temp-object-select');
    select.innerHTML = '<option value="">-- Выберите объект --</option>' +
      objectsData.map(obj => `<option value="${obj.id}">${obj.title} - ${obj.city}</option>`).join('');

    document.getElementById('agentFormModal').style.display = 'flex';
  },

  // Закрыть форму
  closeForm: function () {
    document.getElementById('agentFormModal').style.display = 'none';
  },

  // Обработка PDF
  processPDF: async function () {
    const objectSelect = document.getElementById('temp-object-select');
    if (!objectSelect.value) {
      alert('Выберите объект');
      return;
    }

    const agentData = {
      name: document.getElementById('agent-name-input')?.value || '',
      phone: document.getElementById('agent-phone-input')?.value || '',
      email: document.getElementById('agent-email-input')?.value || '',
      office: document.getElementById('agent-office-input')?.value || ''
    };

    if (!agentData.name || !agentData.phone) {
      alert('Заполните имя и телефон');
      return;
    }

    this.selectedObjectId = objectSelect.value;
    this.closeForm();

    alert('Загрузка объекта...');
    await this.loadObjectAndGeneratePDF(this.selectedObjectId, agentData);
  },

  // Загрузка объекта
  loadObjectAndGeneratePDF: async function (objectId, agentData) {
    try {
      const response = await fetch(`objects/object${objectId}/index.html`);
      const html = await response.text();

      const tempContainer = document.getElementById('tempObjectContainer');
      tempContainer.innerHTML = html;

      const slides = tempContainer.querySelectorAll('.slide:not(.video-slide)');

      if (!slides.length) {
        alert('Слайды не найдены');
        return;
      }

      console.log(`Загружено ${slides.length} слайдов`);
      await this.generatePDFFromSlides(slides, objectId, agentData);
      tempContainer.innerHTML = '';

    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при загрузке объекта');
    }
  },

  // Генерация PDF
  generatePDFFromSlides: async function (slides, objectId, agentData) {
    if (!window.jspdf || !window.html2canvas) {
      alert('Библиотеки PDF не загружены');
      return;
    }

    const object = objectsData.find(obj => obj.id === parseInt(objectId));
    if (!object) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let slideIndex = 0;

    for (let slide of slides) {
      slideIndex++;

      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '1000px';
      tempDiv.appendChild(slide.cloneNode(true));
      document.body.appendChild(tempDiv);

      try {
        const canvas = await html2canvas(tempDiv.querySelector('.slide'), {
          scale: 2,
          backgroundColor: '#f0f2f5',
          useCORS: true
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (slideIndex > 1) doc.addPage();
        doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, (canvas.height * pageWidth) / canvas.width);

      } catch (error) {
        console.error('Ошибка захвата:', error);
      }

      document.body.removeChild(tempDiv);
    }

    // Страница с контактами
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');

    doc.setFontSize(24);
    doc.setTextColor(34, 34, 34);
    doc.setFont('helvetica', 'bold');
    doc.text('КОНТАКТЫ АГЕНТА', pageWidth / 2, 40, { align: 'center' });

    doc.setFontSize(16);
    doc.text(`Имя: ${agentData.name}`, 20, 80);
    doc.text(`Телефон: ${agentData.phone}`, 20, 100);
    doc.text(`Email: ${agentData.email || '—'}`, 20, 120);
    doc.text(`Офис: ${agentData.office || '—'}`, 20, 140);

    doc.save(`${object.title.replace(/\s+/g, '_')}_prezentatsiya.pdf`);
    console.log('PDF готов');
  }
};

// Глобальная ссылка для HTML
window.PDFGenerator = PDFGenerator;
