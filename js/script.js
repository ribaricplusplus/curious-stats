function getData(position) {
  let latitude, longitude, accuracy;
  if (position === null) {
    latitude = null;
    longitude = null;
    accuracy = null;
  } else {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    accuracy = '+-' + position.coords.accuracy + ' meters';
  }

  const data = {
    action: 'data-obtained',
    url: location.hostname,
    aboutYou: [
      {
        label: 'Latitude',
        data: latitude
      },
      {
        label: 'Longitude',
        data: longitude
      },
      {
        label: 'Position accuracy',
        data: accuracy
      },
      {
        label: 'Language',
        data: navigator.language
      }
    ],
    aboutWebsite: [
      {
        label: 'Title',
        data: document.title
      },
      {
        label: 'Character set',
        data: document.characterSet
      },
      {
        label: 'Number of cookies set',
        data: document.cookie.length
      },
      {
        label: 'Number of links',
        data: document.links.length
      },
      {
        label: 'Number of images',
        data: document.images.length
      },
      {
        label: 'Last modified',
        data: document.lastModified
      }
    ]
  };
  return data;
}

function sendData(data) {
  chrome.runtime.sendMessage(data);
}

navigator.geolocation.getCurrentPosition(
  (position) => {
    const data = getData(position);
    sendData(data);
  },
  (error) => {
    const data = getData(null);
    sendData(data);
  }
);
