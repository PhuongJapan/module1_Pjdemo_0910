// let studentManagement =
//   JSON.parse(localStorage.getItem("studentManagement")) || [];
// let studentManagement = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
let arrCourse = localStorage.getItem("studentManagement")
  ? JSON.parse(localStorage.getItem("studentManagement"))
  : [];
let arrClass = [];

function updateArrClass() {
  //Lưu ý chỉ dùng hàm này để render dữ liệu ko sử dụng khi sửa, xóa,...
  arrClass = [];
  arrCourse.forEach((course) => {
    course.arrClass.forEach((classItem) => {
      arrClass = arrClass.concat({
        courseId: course.courseId,
        courseName: course.courseName,
        ...classItem,
      });
    });
  });
}
updateArrClass(arrCourse);
// Cách dùng map
//   arrClass = [];
//   arrCourse.forEach((course) => {
//     let classArrCourse = course.arrClass.map((classItem) => {
//       return {
//         courseName: course.courseName,
//         courseId: course.courseId,
//         ...classItem,
//       };
//     });
//     arrClass = arrClass.concat(classArrCourse);
//   });
//   console.log(arrClass);
//   localStorage.setItem("arrClass", JSON.stringify(arrClass));
// }
document.getElementById("btnLogout").addEventListener("click", function () {
  //Xóa item có tên userLogin trong localStorage
  localStorage.removeItem("userLogin");
  //Điều hướng về Login
  window.location.href = "login.html";
});
// let arrCourse = JSON.parse(localStorage.getItem("studentManagement")) || [];

let action = "Create";
//Phân trang

let currentPage = 1;
let recordsPerPage = 3;

function renderData(page) {
  // Hiển thị số trang
  let totalPage = getTotalPage();
  let listPage = document.getElementById("listPage");
  listPage.innerHTML = "";
  for (let i = 1; i <= totalPage; i++) {
    listPage.innerHTML += `
       <li><a href="javascript:clickPage('${i}')">${i}</a></li>
       `;
  }
  // Nếu ở trang 1 thì ẩn preview còn nếu ở trang cuối thì ẩn next
  if (page == 1) {
    document.getElementById("preview").style.visibility = "hidden";
  } else {
    document.getElementById("preview").style.visibility = "visible";
  }
  if (page == totalPage) {
    document.getElementById("next").style.visibility = "hidden";
  } else {
    document.getElementById("next").style.visibility = "visible";
  }
  //Tính index của dữ liệu hiển thị trên table
  let firstIndex = (page - 1) * recordsPerPage;
  let lastIndex = page * recordsPerPage;
  if (lastIndex > arrClass.length) {
    lastIndex = arrClass.length;
  }

  let listClass = document.getElementById("listClass");
  listClass.innerHTML = "";
  for (let index = firstIndex; index < lastIndex; index++) {
    listClass.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${arrClass[index].classId}</td>
                <td>${arrClass[index].className}</td>                
                <td>${arrClass[index].teacher}</td>
                <td>${arrClass[index].descriptions}</td>
                <td>${arrClass[index].studentNumber}</td>
                <td>${arrClass[index].status}</td>
                <td>${arrClass[index].courseName}</td>
                <td>
                    <button id="btnEditClass" class="btn btn-success" onclick="displayDataToEdit('${
                      arrClass[index].classId
                    }')"> 
                    <i class="fa-solid fa-pen-to-square" ></i></button>
                    <button id="btnDeleteClass" class="btn btn-danger" onclick="deleteClass('${
                      arrClass[index].classId
                    }')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
  }
}

function getTotalPage() {
  return Math.ceil(arrClass.length / recordsPerPage);
}

function clickPage(page) {
  currentPage = page;
  // let arrCourse = JSON.parse(localStorage.getItem("studentManagement")) || [];
  renderData(page, arrClass);
}
// Hàm previewPage
function previewPage() {
  currentPage--;
  // render lại dữ liệu lên table
  // let arrCourse = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
  renderData(currentPage, arrClass);
}
// Hàm nextPage
function nextPage() {
  currentPage++;
  renderData(currentPage, arrClass);
}

var newClassModal = new bootstrap.Modal(document.getElementById("newClass"), {
  keyboard: false,
});

//Thẽm mới lớp học
function createClass() {
  //2. Lấy dữ liệu trên modal
  let newClass = getDataForm();

  if (!validateClassId(classId)) {
    return;
  }
  if (!validateClassName(className)) {
    return;
  }
  //thêm mới
  let courseIdOfNewClass = newClass.courseId;
  let courseIndex = getCourseIdOfClass(arrCourse, courseIdOfNewClass);
  delete newClass.courseId;
  if (courseIndex == -1) {
    return;
  }
  arrCourse[courseIndex].arrClass.push(newClass);

  localStorage.setItem("studentManagement", JSON.stringify(arrCourse));
  updateArrClass(arrCourse);

  //5. Đóng modal
  document.getElementById("courseId").value = "";
  document.getElementById("classId").value = "";
  document.getElementById("className").value = "";
  document.getElementById("teacher").value = "";
  document.getElementById("studentNumber").value = "";
  document.getElementById("descriptions").value = "";
  document.getElementById("status").value = "";
  // document.getElementById("inActive").selected = true;
  // let optionFirst = document.getElementById("courseName");
  // if (optionFirst.length != 0) {
  //   optionFirst[0].selected = true;
  // }
  newClassModal.hide();
  //render lại dữ liệu
  renderData(currentPage);
}
// let modalCloseCreateData = document.getElementById("se");
// modalCloseCreateData.addEventListener("hide.bs.modal", function () {
//   clearForm();
//   // document.getElementById("courseId").readOnly = false;
// });

function getCourseIdOfClass(arrCourse, courseId) {
  for (let i = 0; i < arrCourse.length; i++) {
    if (arrCourse[i].courseId === courseId) {
      return i;
    }
  }
  return -1;
}

// function validate courseId
function validateClassId(classId) {
  let indexToFind = arrClass.findIndex(
    (element) => element.classId === classId
  );
  if (indexToFind >= 0) {
    //Đã tồn tại mã danh mục trong arrCourse
    // document.getElementById("courseId").style.backgroundColor=="yellow";
    alert("Mã lớp học đã tồn tại");
    return false;
  }
  // document.getElementById("courseId").style.backgroundColor =="";
  return true;
}
function validateClassName(className) {
  let indexToFind = arrClass.findIndex(
    (element) => element.className === className
  );
  //Nếu indexToFind>=0 tức là index đã tồn tại trong mảng
  if (indexToFind >= 0) {
    document.getElementById("className").style.backgroundColor == "yellow";
    alert("Tên lớp học đã tồn tại");
    return false;
  }
  document.getElementById("className").style.backgroundColor == "";
  return true;
}

// Hàm lấy dữ liệu trên inputForm
function getDataForm() {
  let courseId = document.getElementById("courseId").value;
  let classId = document.getElementById("classId").value;
  let className = document.getElementById("className").value;
  let teacher = document.getElementById("teacher").value;
  let studentNumber = document.getElementById("studentNumber").value;
  let descriptions = document.getElementById("descriptions").value;
  let status = document.getElementById("status").value;
  let courseClass = {
    courseId,
    classId,
    className,
    teacher,
    studentNumber,
    descriptions,
    status,
    arrStudent: [],
  };
  return courseClass;
}
document
  .getElementById("btnCreateClass")
  .addEventListener("click", function (event) {
    event.preventDefault();

    if (action == "Create") {
      createClass();
      newClassModal.hide();
    } else {
      editClass();
    }
  });

// function getDataFormEdit() {
//   let courseId = document.getElementById("courseIdEdit").value;
//   let courseName = document.getElementById("courseNameEdit").value;
//   let courseTime = document.getElementById("courseTimeEdit").value;
//   // let status = document.querySelector("input[type='radio']:checked").value;
//   let status =
//     document.querySelector("input[type='radio']:checked").value == "true"
//       ? true
//       : false;
//   let class = { courseId, courseName, courseTime, status, arrClass: [] };
//   return class;
// }
//Function clearForm
function clearForm() {
  document.getElementById("classId").value = "";
  document.getElementById("className").value = "";
  document.getElementById("teacher").value = "";
  document.getElementById("studentNumber").value = "";
  document.getElementById("descriptions").value = "";
  document.getElementById("status").value = "";

  // document.getElementById("inActive").selected = true;
  // let optionFirst = document.getElementById("courseName");
  // if (optionFirst.length != 0) {
  //   optionFirst[0].selected = true;
  // }
}

// Xử lý EditClass
// let myModalEditClass= new bootstrap.Modal(document.getElementById("editClass"), {
//   keyboard: false,
// });
// function displayDataToEdit(courseId) {
//   myModalEditCourse.show();
//   let indexUpdate = getCourseById(courseId);
//   if (indexUpdate >= 0) {
//     document.getElementById("courseIdEdit").value = arrCourse[indexUpdate].courseId;
//     document.getElementById("courseNameEdit").value =
//       arrCourse[indexUpdate].courseName;
//     document.getElementById("courseTimeEdit").value =
//       arrCourse[indexUpdate].courseTime;
//     if (arrCourse[indexUpdate].status == "true") {
//       document.getElementById("activeEdit").value = "Hoạt động";
//     } else {
//       document.getElementById("inActiveEdit").value = "Không hoạt động";
//     }
//   }
//   action = "Edit";
// }

// let modalCloseUpdateData = document.getElementById("editCourse");
// modalCloseUpdateData.addEventListener("hide.bs.modal", function () {
//   clearForm();
// document.getElementById("courseId").readOnly = false;
// });

// // Hàm lấy thông tin class theo Id
// function getCourseById(courseId) {
//   for (let index = 0; index < arrCourse.length; index++) {
//     if (arrCourse[index].courseId == courseId) {
//       return index;
//     }
//   }
//   return -1;
// }

// function editCourseInfo() {
//   let editCourseInfo = getDataFormEdit();
//   let index = getCourseById(editCourseInfo.courseId);
//   if (index > -1) {
//     arrCourse[index] = editCourseInfo;
//   }
//   localStorage.setItem("studentManagement", JSON.stringify(arrCourse));

//   action = "Create";
//   clearForm();
//   myModalEditCourse.hide();
//   renderData(currentPage);
// }
// document.getElementById("btnEditSave").addEventListener("click", function(event){
//     event.preventDefault();
//     editCourseInfo();
// })

//Hàm xóa class
let myModalDeleteClass = new bootstrap.Modal(
  document.getElementById("deleteClass"),
  {
    keyboard: false,
  }
);
function getClassIndexInCourse(arrCLassInCourse, classId) {
  for (let i = 0; i < arrCLassInCourse.length; i++) {
    if (arrCLassInCourse[i].classId === classId) {
      return i;
    }
  }
  return -1;
}
function deleteClass(classId, courseId) {
  myModalDeleteClass.show();

  let yesToDeleteClass = document.getElementById("yesToDeleteClass");
  let noToDeleteClass = document.getElementById("noToDeleteClass");
  yesToDeleteClass.onclick = function () {
    let arrCourse = localStorage.getItem("studentManagement")
      ? JSON.parse(localStorage.getItem("studentManagement"))
      : [];

    let courseIndex = getCourseIdOfClass(arrCourse, courseId);
    let classIndex = getClassIndexInCourse(
      arrCourse[courseIndex].arrClass,
      classId
    );
    
    arrCourse[courseIndex].arrClass.splice(classIndex, 1);

    localStorage.setItem("studentManagement", JSON.stringify(arrCourse));
    updateArrClass(arrCourse);
    renderData(currentPage);
    myModalDeleteClass.hide();
  };
  noToDeleteClass.onclick = function () {
    myModalDeleteClass.hide();
  };
}

    //     if (index !== -1) {
    //   let courseId = arrClass[index].courseId;
    //   arrClass.splice(index, 1);
    //   localStorage.setItem("arrClass", JSON.stringify(arrClass));
    //   let deleteArrClass=localStorage.getItem("arrClass") ? JSON.parse(localStorage.getItem("arrClass")) : [];
    //   let courseIndex = deleteArrClass.findIndex(
    //     (item)=>item.courseId===courseId
    //   );
    //   if(courseIndex!==-1){
    //     let classIndex = deleteArrClass.findIndex(
    //       (item)=>item.classId===id
    //     );
    //     if (classIndex!==1) {
    //       deleteArrClass.splice(classIndex,1);
    //       localStorage.setItem("arrClass",JSON.stringify(arrClass));

    //     }
    //   }
    //   renderData(currentPage);

    // }
    // myModalDeleteClass.hide();
 

//Thực hiện search khóa học
document
  .getElementById("btnSearchClassName")
  .addEventListener("click", function () {
    let searchClassName = document.getElementById("searchClassName").value;
    let searchArrClass = localStorage.getItem("arrClass")
      ? JSON.parse(localStorage.getItem("arrClass"))
      : [];
    // let searchArrCourse = JSON.parse(localStorage.getItem("arrCourse"));
    let filterData = searchArrClass.filter((item) =>
      item.className.toLowerCase().includes(searchClassName.toLowerCase())
    );

    if (filterData.length < 1) {
      alert("Không tìm thấy kết quả");
    } else if (filterData.length > 0) {
      arrClass = filterData;
      renderData(1);
    }
  });

//Thực hiện sort dữ liệu
function orderClassName() {
  let arrClassSort = localStorage.getItem("arrClass")
    ? JSON.parse(localStorage.getItem("arrClass"))
    : [];
  let sortClassNameVal = document.getElementById("orderClassName").value;
  switch (sortClassNameVal) {
    case "nameASC":
      arrClassSort.sort((a, b) =>
        a.className > b.className ? 1 : a.className < b.className ? -1 : 0
      );
      break;
    case "nameDESC":
      arrClassSort.sort((a, b) =>
        a.className < b.courseName ? 1 : a.className > b.className ? -1 : 0
      );
      break;
  }
  arrClass = arrClassSort;
  renderData(1);
}

document
  .getElementById("orderClassName")
  .addEventListener("change", function () {
    orderClassName();
  });

function redirectDashboard() {
  window.location.href = "dashboard.html";
}
function redirectCourseManagement() {
  window.location.href = "courseMana.html";
}
function redirectClassManagement() {
  window.location.href = "classMana.html";
}
function redirectStudentManagement() {
  window.location.href = "studentMana.html";
}
window.onload = renderData(currentPage);
