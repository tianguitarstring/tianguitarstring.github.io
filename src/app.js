document.addEventListener('alpine:init', () => {
  Alpine.data('products', () => ({
    items: [
      { id: 1, name: 'Senar No.1', img: 'S1.jpg', price: 15000},
      { id: 2, name: 'Senar No.2', img: 'S2.jpg', price: 15000},
      { id: 3, name: 'Senar No.3', img: 'S3.jpg', price: 15000},
      { id: 4, name: 'Senar No.4', img: 'S4.jpg', price: 15000},
      { id: 5, name: 'Senar No.5', img: 'S5.jpg', price: 15000},
      { id: 5, name: 'Senar No.6', img: 'S6.jpg', price: 15000},
    ],
  }));

  Alpine.store('cart', {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      //cek apakah ada brg yg sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);
      //jika belum ada / kosong
      if(!cartItem) {
        this.items.push({...newItem, quantity: 1, total: newItem.price});
        this.quantity++;
        this.total += newItem.price;
      } else {
        //jika brg sdh ada, cek apakah brg beda atau sama dng yg ada di cart
        this.items = this.items.map((item) => {
          //jika beda
          if(item.id !== newItem.id) {
            return item;
          } else {
            //jika barang sama, tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        })
      }
    },
    remove (id) {
      //ambil item yg akan di remove berdasarkan id
      const cartItem = this.items.find((item) => item.id === id);
      //jika item lebih dari satu
      if(cartItem.quantity > 1) {
      //maka cek satu persatu
        this.items = this.items.map((item) => {
      //jika bukan brg yg di klik skip
          if(item.id !== id) {
            return item;
          } else {
            //tapi jika benar kurangi
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        })
      } else if (cartItem.quantity === 1) {
        //jika brg sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    }
  });
});

// form validasi
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function() {
  for(let i = 0; i < form.elements.length; i++) {
    if(form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove('disabled');
      checkoutButton.classList.add('disabled');
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove('disabled');
});

// kirim data setelah tombol checkout di klik
checkoutButton.addEventListener('click', function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open('https://wa.me/6283827970999?text=' + encodeURIComponent(message));
});

//format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Customer
  Nama: ${obj.name}
  Email: ${obj.email}
  No HP: ${obj.phone}
  Data Pesanan
  ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
  TOTAL: ${rupiah(obj.total)}
  Terima kasih`;
};

//konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
}