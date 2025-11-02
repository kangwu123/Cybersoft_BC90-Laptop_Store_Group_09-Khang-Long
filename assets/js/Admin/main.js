const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');

sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', () => {
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});

const menuBar = document.querySelector('.content nav .bx.bx-menu');
const sideBar = document.querySelector('.sidebar');

menuBar.addEventListener('click', () => {
    sideBar.classList.toggle('close');
});

const searchBtn = document.querySelector('.content nav form .form-input button');
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
const searchForm = document.querySelector('.content nav form');

searchBtn.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault;
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchBtnIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchBtnIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add('close');
    } else {
        sideBar.classList.remove('close');
    }
    if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});

const toggler = document.getElementById('theme-toggle');

toggler.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});
/**
 *  Right Side & Dropdown select type
 */
  document.addEventListener('DOMContentLoaded', function () {
            const sideMenu = document.querySelectorAll('.side-menu li');
            const sections = document.querySelectorAll('main');
            const productsSection = document.getElementById('products-section');
            const dashboardSection = document.getElementById('dashboard-section');

            // Initially hide the products section
            productsSection.classList.add('hidden');

            sideMenu.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    sideMenu.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');

                    const target = item.querySelector('a').innerText;

                    sections.forEach(section => {
                        section.classList.add('hidden');
                    });

                    if (target === 'Dashboard') {
                        dashboardSection.classList.remove('hidden');
                    } else if (target === 'Products') {
                        productsSection.classList.remove('hidden');
                    }
                });
            });
        });

        function filterByBrand() {
            var selectedBrand = document.getElementById("brandFilter").value;
            var tableRows = document.querySelectorAll("#products-section tbody tr");

            tableRows.forEach(function(row) {
                var productName = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
                if (selectedBrand === "all" || productName.includes(selectedBrand.toLowerCase())) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        }