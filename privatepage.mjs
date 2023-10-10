
// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  deleteDoc,
  doc,
  where,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 구성 정보 설정
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7n4rJxoQvx9ZKH3HYxLkEeroMFydeQP0",
  authDomain: "a-11-2e110.firebaseapp.com",
  projectId: "a-11-2e110",
  storageBucket: "a-11-2e110.appspot.com",
  messagingSenderId: "192520789356",
  appId: "1:192520789356:web:2324b1cdccc9bf383de749",
  measurementId: "G-P93QHPYJC8",
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 팀원 이름 테스트 변수 설정
let test_name = "김민성";

//등록 시간 순서대로 정렬 후 화면에 출력
async function guest_book_upload() {
  const guest_book = collection(db, "guest_book");
  const result = await getDocs(query(guest_book, orderBy("date", "desc")));
  const guest_books = result.docs.map((el) => el.data());

  guest_books.forEach((row) => {
    if (row["member_name"] == test_name) {
      let guest_name = row["guest_name"];
      let password = row["password"];
      let text = row["content"];
      let date = row["date"];

      let element = `
                    <div class="guestbook_content">
                      <div>
                        <div>
                        <div class="guestbook_name">${guest_name}</div>
                        <div class="guestbook_date">${date}</div>
                        </div>
                        <button type="button" class="btn delete_btn">삭제</button>
                      </div>
                        <p class="guestbook_text" >${text}</p>
                    </div>
                `;
      $(".guestbook").append(element);
    }
  });
}

guest_book_upload();

// 입력받은 방명록을 데이터 베이스에 저장
$("#resister_btn").click(async function () {
  let member_name = test_name;
  let guest_name = $(".maker_name").val();
  let password = $(".maker_password").val();
  let text = $(".maker_text").val();

  //닉네임이 6글자를 초과할 경우 페이지 새로고침, 경고창 출력
  if (guest_name.length > 6) {
    alert("닉네임은 6글자 이내로 작성해주세요!");
    window.location.reload();
    return;
  }

  // 등록했을 때 날짜 가져오기

  let today = new Date();
  let year = today.getFullYear();
  let month = ("0" + (today.getMonth() + 1)).slice(-2);
  let day = ("0" + today.getDate()).slice(-2);
  let hour = today.getHours();
  let minute = today.getMinutes();
  let second = today.getSeconds();
  console.log(hour, minute, second);

  let dateString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

  let doc = {
    member_name: member_name,
    guest_name: guest_name,
    password: password,
    content: text,
    date: dateString,
  };

  await addDoc(collection(db, "guest_book"), doc);

  alert("저장 완료!");
  window.location.reload();
});

// 삭제 버튼 눌렀을 때 데이터 베이스에서 방명록 데이터 삭제
$(document).on("click", ".delete_btn", async function (event) {
  const node =
    event.target.parentElement.parentElement.firstElementChild.firstElementChild
      .lastElementChild;
  const target_date = node.innerHTML;

  //비밀번호 입력
  const password = prompt("비밀번호를 입력해주세요.");

  //데이터베이스에서 등록 날짜, 비밀번호 대조해서 나온 데이터 q에 저장
  const q = query(
    collection(db, "guest_book"),
    where("date", "==", target_date),
    where("password", "==", password)
  );

  // 해당 쿼리를 실행하여 문서를 가져옴
  const querySnapshot = await getDocs(q);

  // 비밀번호가 맞았을 경우 a는 True 아니면 False
  let a = false;

  // 각 문서에 대해 삭제 작업 수행
  querySnapshot.forEach(async (doc) => {
    a = true;
    console.log(a);
    try {
      // 문서 삭제
      await deleteDoc(doc.ref);
      console.log(doc.ref);

      console.log("Document successfully deleted!");
    } catch (error) {
      console.log("asdasd");
      console.error("Error deleting document:", error);
    }

    // 삭제 완료 메시지 출력
    alert("삭제 완료!");

    // 페이지 새로고침 후 함수 탈출
    window.location.reload();
    return;
  });

  // 위에서 삭제가 이루어지지 않은 경우 -> 비밀번호 틀림
  if (a == false) {
    alert("비밀번호가 틀렸습니다.");
  }
});

$("#back_btn").click(async function () {
  let link = "main_page.html";

  location.href = link;
  location.replace(link);
  window.open(link);
});
