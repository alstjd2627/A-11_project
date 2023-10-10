
import { aaa } from "./privatepage.mjs";
aaa("김민성")


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


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD7n4rJxoQvx9ZKH3HYxLkEeroMFydeQP0",
    authDomain: "a-11-2e110.firebaseapp.com",
    projectId: "a-11-2e110",
    storageBucket: "a-11-2e110.appspot.com",
    messagingSenderId: "192520789356",
    appId: "1:192520789356:web:2324b1cdccc9bf383de749",
    measurementId: "G-P93QHPYJC8"
};


// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* 팀원 추가 페이지 이동 */
$("#adbtn").click(async function () {
    window.location.href = 'addperson.html'
})

/* 팀원 상세 페이지 이동 */
$(document).on('click', '#teamperson_exp', function () {
    alert("동작확인");
    window.location.href = 'privatepage.html'

})

/* 팀원 삭제 페이지 */
$(document).on("click", ".delbtn", async function (event) {
    const node =
        event.target.parentElement.lastElementChild.firstElementChild;
    const name = node.innerHTML;
    //데이터베이스에서 등록 날짜, 비밀번호 대조해서 나온 데이터 q에 저장
    const q = query(
        collection(db, "team_member"),
        where("member_name", "==", name)
    );

    // 해당 쿼리를 실행하여 문서를 가져옴
    const querySnapshot = await getDocs(q);

    // 각 문서에 대해 삭제 작업 수행
    querySnapshot.forEach(async (doc) => {
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
});

/* 팀원 정보 불러오기 */
let docs = await getDocs(collection(db, "team_member"));
docs.forEach((doc) => {
    let row = doc.data();
    console.log(row);

    let image = row['image'];
    let member_name = row['member_name'];
    let blog = row['blog'];
    let temp_html =
        `<li class="team-item">
        <div class="profile">
            <button type="button" class="btn delbtn">X</button>
            <img id="teamperson_exp"
                src="${image}">
            <div class="profile-contents">
                <h2>${member_name}</h2>
                <p>${blog}</p>
            </div>
        </div>
    </li>`;
    $('#teamperson').append(temp_html)

});
