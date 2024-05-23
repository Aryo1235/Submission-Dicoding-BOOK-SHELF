const localStorageKey = "BUKU_DATA";

const judul = document.querySelector("#judul_buku");
const errorJudul = document.querySelector("#errorJudul");
const sectionTitle = document.querySelector("#sectionJudul");

const penulis = document.querySelector("#penulis");
const errorPenulis = document.querySelector("#errorPenulis");
const sectionPenulis = document.querySelector("#sectionPenulis");

const tahun = document.querySelector("#tahun");
const errortahun = document.querySelector("#errorTahun");
const sectiontahun = document.querySelector("#sectionTahun");

const readed = document.querySelector("#inputBookIsComplete");

const btn_sub = document.querySelector("#buku_sub");

const src_value = document.querySelector("#cariBuku");
const btnSearch = document.querySelector("#searchSubmit");

let cekInput = [];
let cekjudul = null;
let cekPenulis = null;
let cekTahun = null;

window.addEventListener("load", function () {
  if (localStorage.getItem(localStorageKey) !== null) {
    const databuku = getData();
    showData(databuku);
  }
});

btnSearch.addEventListener("click", function (e) {
  e.preventDefault();
  if (localStorage.getItem(localStorageKey) == null) {
    return alert("Tidak ada data buku");
  } else {
    const ambil_judul = getData().filter(
      (a) => a.judul == src_value.value.trim()
    );
    if (ambil_judul.length == 0) {
      const ambil_penulis = getData().filter(
        (a) => a.penulis == src_value.value.trim()
      );
      if (ambil_penulis.length == 0) {
        const ambil_tahun = getData().filter(
          (a) => a.tahun == src_value.value.trim()
        );
        if (ambil_tahun.length == 0) {
          alert(`tidak ditemukan: ${src_value.value}`);
        } else {
          showSearchResult(ambil_tahun);
        }
      } else {
        showSearchResult(ambil_penulis);
      }
    } else {
      showSearchResult(ambil_judul);
    }
  }

  src_value.value = "";
});

btn_sub.addEventListener("click", function () {
  if (btn_sub.value == "") {
    cekInput = [];

    judul.classList.remove("error");
    penulis.classList.remove("error");
    tahun.classList.remove("error");

    errorJudul.classList.add("error-display");
    errorPenulis.classList.add("error-display");
    errortahun.classList.add("error-display");

    if (judul.value == "") {
      cekjudul = false;
    } else {
      cekjudul = true;
    }

    if (penulis.value == "") {
      cekPenulis = false;
    } else {
      cekPenulis = true;
    }

    if (tahun.value == "") {
      cekTahun = false;
    } else {
      cekTahun = true;
    }

    cekInput.push(cekjudul, cekPenulis, cekTahun);
    let resultCheck = validation(cekInput);

    if (resultCheck.includes(false)) {
      return false;
    } else {
      const bukuBaru = {
        id: +new Date(),
        judul: judul.value.trim(),
        penulis: penulis.value.trim(),
        tahun: parseInt(tahun.value.trim(), 10),
        isComplete: readed.checked,
      };
      insertData(bukuBaru);

      judul.value = "";
      penulis.value = "";
      tahun.value = "";
      readed.checked = false;
    }
  } else {
    const dataBuku = getData().filter((a) => a.id != btn_sub.value);
    localStorage.setItem(localStorageKey, JSON.stringify(dataBuku));

    const bukuBaru = {
      id: btn_sub.value,
      judul: judul.value.trim(),
      penulis: penulis.value.trim(),
      tahun: parseInt(tahun.value.trim(), 10),
      isComplete: readed.checked,
    };
    insertData(bukuBaru);
    btn_sub.innerHTML = "add book";
    btn_sub.value = "";
    judul.value = "";
    penulis.value = "";
    tahun.value = "";
    readed.checked = false;
    alert("Buku Berhasil Di edit");
  }
});

function validation(check) {
  let resultCheck = [];

  check.forEach((a, i) => {
    if (a == false) {
      if (i == 0) {
        judul.classList.add("error");
        errorJudul.classList.remove("error-display");
        resultCheck.push(false);
      } else if (i == 1) {
        penulis.classList.add("error");
        errorPenulis.classList.remove("error-display");
        resultCheck.push(false);
      } else {
        tahun.classList.add("error");
        errortahun.classList.remove("error-display");
        resultCheck.push(false);
      }
    }
  });

  return resultCheck;
}

function insertData(book) {
  let dataBuku = [];

  if (localStorage.getItem(localStorageKey) === null) {
    localStorage.setItem(localStorageKey, 0);
  } else {
    dataBuku = JSON.parse(localStorage.getItem(localStorageKey));
  }

  dataBuku.unshift(book);
  localStorage.setItem(localStorageKey, JSON.stringify(dataBuku));

  showData(getData());
}

function getData() {
  return JSON.parse(localStorage.getItem(localStorageKey)) || [];
}

function showData(books = []) {
  const inCompleted = document.querySelector("#belum_dibaca");
  const completed = document.querySelector("#sudah_dibaca");

  inCompleted.innerHTML = "";
  completed.innerHTML = "";

  books.forEach((book) => {
    if (book.isComplete == false) {
      let el = `
            <article class="buku_item">
                <h3>${book.judul}</h3>
                <p>Penulis: ${book.penulis}</p>
                <p>Tahun: ${book.tahun}</p>
                <div class="action">
                    <button class="green" onclick="readedBook('${book.id}')">Pindahkan</button>
                    <button class="yellow" onclick="editbuku('${book.id}')">edit buku</button>
                    <button class="red" onclick="deletebuku('${book.id}')">hapus buku</button>
                </div>
            </article>
            `;

      inCompleted.innerHTML += el;
    } else {
      let el = `
            <article class="buku_item">
                <h3>${book.judul}</h3>
                <p>Penulis: ${book.penulis}</p>
                <p>Tahun: ${book.tahun}</p>
                <div class="action">
                    <button class="green" onclick="unreadedBook('${book.id}')">Pindahkan</button>
                    <button class="yellow" onclick="editbuku('${book.id}')">edit buku</button>
                    <button class="red" onclick="deletebuku('${book.id}')">hapus buku</button>
                </div>
            </article>
            `;
      completed.innerHTML += el;
    }
  });
}

function showSearchResult(books) {
  const searchResult = document.querySelector("#searchResult");

  searchResult.innerHTML = "";

  books.forEach((book) => {
    let el = `
        <article class="buku_item">
            <h3>${book.judul}</h3>
            <p>penulis: ${book.penulis}</p>
            <p>tahun: ${book.tahun}</p>
            <p>${book.isComplete ? "Sudah dibaca" : "Belum dibaca"}</p>
        </article>
        `;

    searchResult.innerHTML += el;
  });
}

function readedBook(id) {
  let konfirmasi = confirm("pindahkan ke Telah dibaca?");

  if (konfirmasi == true) {
    const dataBukuDetail = getData().filter((a) => a.id == id);
    const bukuBaru = {
      id: dataBukuDetail[0].id,
      judul: dataBukuDetail[0].judul,
      penulis: dataBukuDetail[0].penulis,
      tahun: dataBukuDetail[0].tahun,
      isComplete: true,
    };

    const dataBuku = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(dataBuku));

    insertData(bukuBaru);
  } else {
    return 0;
  }
}

function unreadedBook(id) {
  let konfirmasi = confirm("pindahkan ke Belum dibaca?");

  if (konfirmasi == true) {
    const dataBukuDetail = getData().filter((a) => a.id == id);
    const bukuBaru = {
      id: dataBukuDetail[0].id,
      judul: dataBukuDetail[0].judul,
      penulis: dataBukuDetail[0].penulis,
      tahun: dataBukuDetail[0].tahun,
      isComplete: false,
    };

    const dataBuku = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(dataBuku));

    insertData(bukuBaru);
  } else {
    return 0;
  }
}

function editbuku(id) {
  const dataBukuDetail = getData().filter((a) => a.id == id);
  judul.value = dataBukuDetail[0].judul;
  penulis.value = dataBukuDetail[0].penulis;
  tahun.value = dataBukuDetail[0].tahun;
  dataBukuDetail[0].isComplete
    ? (readed.checked = true)
    : (readed.checked = false);

  btn_sub.innerHTML = "edit buku";
  btn_sub.value = dataBukuDetail[0].id;
}

function deletebuku(id) {
  let konfirmasi = confirm("apakah kamu yakin menghapus buku ini?");

  if (konfirmasi == true) {
    const dataBukuDetail = getData().filter((a) => a.id == id);
    const dataBuku = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(dataBuku));
    showData(getData());
    alert(`buku ${dataBukuDetail[0].judul} telah di hapus`);
  } else {
    return 0;
  }
}
