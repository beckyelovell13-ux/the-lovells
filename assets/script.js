const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.site-navigation');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('open');
    });
  });
}

const year = document.querySelector('#current-year');
if (year) year.textContent = new Date().getFullYear();

const generatedGallery = document.querySelector('[data-gallery-path][data-photo-prefix][data-photo-count]');
if (generatedGallery) {
  const galleryPath = generatedGallery.dataset.galleryPath;
  const photoPrefix = generatedGallery.dataset.photoPrefix;
  const photoCount = Number.parseInt(generatedGallery.dataset.photoCount, 10);
  const fragment = document.createDocumentFragment();

  for (let photoNumber = 1; photoNumber <= photoCount; photoNumber += 1) {
    const filename = `${photoPrefix}-${String(photoNumber).padStart(3, '0')}.jpg`;
    const galleryName = generatedGallery.getAttribute('aria-label') || 'Gallery';
    const label = `${galleryName.replace(/ photographs$/, '')} photograph ${photoNumber} of ${photoCount}`;
    const button = document.createElement('button');
    const image = document.createElement('img');

    button.className = 'photo-button';
    button.type = 'button';
    button.setAttribute('aria-label', `Open ${label}`);
    image.src = `${galleryPath}/thumbs/${filename}`;
    image.dataset.fullSrc = `${galleryPath}/${filename}`;
    image.alt = label;
    image.loading = 'lazy';
    image.decoding = 'async';
    button.append(image);
    fragment.append(button);
  }

  generatedGallery.append(fragment);
}

const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const images = [...document.querySelectorAll('.photo-button img')];
  const lightboxImage = lightbox.querySelector('img');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const previousButton = lightbox.querySelector('.lightbox-prev');
  const nextButton = lightbox.querySelector('.lightbox-next');
  let currentIndex = 0;
  let lastFocused;

  const showImage = (index) => {
    currentIndex = (index + images.length) % images.length;
    lightboxImage.src = images[currentIndex].dataset.fullSrc || images[currentIndex].src;
    lightboxImage.alt = images[currentIndex].alt;
  };

  const openLightbox = (index, trigger) => {
    lastFocused = trigger;
    showImage(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  document.querySelectorAll('.photo-button').forEach((button, index) => {
    button.addEventListener('click', () => openLightbox(index, button));
  });
  closeButton.addEventListener('click', closeLightbox);
  previousButton.addEventListener('click', () => showImage(currentIndex - 1));
  nextButton.addEventListener('click', () => showImage(currentIndex + 1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}
