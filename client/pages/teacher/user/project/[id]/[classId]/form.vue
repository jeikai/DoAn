<template>
  <table
    style="border-collapse: collapse; margin-left: 5.824pt"
    cellspacing="0"
  >
    <tr style="height: 60pt">
      <td style="width: 239pt">
        <p
          class="s1"
          style="
            padding-left: 10pt;
            text-indent: 0pt;
            line-height: 13pt;
            text-align: left;
          "
        >
          TRƯỜNG ĐẠI HỌC KIẾN TRÚC HÀ NỘI
        </p>
        <p
          class="s2"
          style="padding-left: 28pt; text-indent: 0pt; text-align: center"
        >
          KHOA CÔNG NGHỆ THÔNG TIN
        </p>
        <p
          style="
            padding-left: 52pt;
            text-indent: 0pt;
            line-height: 1pt;
            text-align: center;
          "
        >
          <span
            ><img
              width="208"
              height="1"
              alt="image"
              src="../../../../../../assets/images/logo_pdf.jpg"
          /></span>
        </p>
        <p style="text-indent: 0pt; text-align: left"><br /></p>
        <p style="text-indent: 0pt; text-align: left"><br /></p>
      </td>
      <td style="width: 265pt">
        <p
          class="s1"
          style="
            padding-left: 14pt;
            text-indent: 0pt;
            line-height: 13pt;
            text-align: center;
          "
        >
          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
        </p>
        <p
          class="s3"
          style="
            padding-bottom: 1pt;
            padding-left: 56pt;
            text-indent: 0pt;
            text-align: center;
          "
        >
          Độc lập - Tự do - Hạnh phúc
        </p>
        <p
          style="
            padding-left: 52pt;
            text-indent: 0pt;
            line-height: 1pt;
            text-align: center;
          "
        >
          <span
            ><img
              width="208"
              height="1"
              alt="image"
              src="../../../../../../assets/images/logo_pdf.jpg"
          /></span>
        </p>
        <p
          class="s4"
          style="
            padding-top: 12pt;
            padding-left: 61pt;
            text-indent: 0pt;
            line-height: 15pt;
            text-align: center;
          "
        >
          Hà Nội, ngày {{ currentDate.getDate() }} tháng {{ currentMonth }} năm
          {{ currentDate.getFullYear() }}
        </p>
      </td>
    </tr>
  </table>
  <p style="text-indent: 0pt; text-align: left"><br /></p>
  <h1
    style="
      padding-top: 4pt;
      padding-left: 60pt;
      text-indent: 0pt;
      text-align: center;
    "
  >
    PHIẾU CHẤM ĐIỂM BẢO VỆ ĐỒ ÁN/KHÓA LUẬN TỐT NGHIỆP
  </h1>
  <p style="text-indent: 0pt; text-align: left"><br /></p>
  <p
    style="
      padding-top: 10pt;
      padding-left: 24pt;
      text-indent: 0pt;
      text-align: left;
    "
  >
    1. Họ và tên sinh viên: {{ userData.name }} Mã số sinh viên:
    {{ userData._id }}
  </p>

  <p
    style="
      padding-top: 10pt;
      padding-left: 24pt;
      text-indent: 0pt;
      text-align: left;
    "
  >
    2. Lớp: {{ userData.Department }}
  </p>
  <p
    style="
      padding-top: 10pt;
      padding-left: 24pt;
      text-indent: 0pt;
      text-align: left;
    "
  >
    3. Ngành {{ userData.Majors }}
  </p>
  <p
    style="
      padding-top: 10pt;
      padding-left: 24pt;
      text-indent: 0pt;
      text-align: left;
    "
  >
    4. Tên đề tài khóa luận tốt nghiệp: {{ projectInfo.projectName }}
  </p>
  <ol id="l1">
    <li>
      <p
        style="
          padding-top: 10pt;
          padding-left: 36pt;
          text-indent: -12pt;
          text-align: left;
        "
      >
        Phần cho điểm của Thành viên Hội đồng chấm khóa luận tốt nghiệp
      </p>
      <p
        class="s5"
        style="
          padding-top: 10pt;
          padding-left: 24pt;
          text-indent: 0pt;
          line-height: 130%;
          text-align: left;
        "
      >
        (Các chi tiết đánh giá có điểm lẻ đến 0.1, điểm cuối cùng làm tròn đến
        chữ số thứ nhất của phần thập phân)
      </p>
      <p style="text-indent: 0pt; text-align: left"><br /></p>
      <table
        style="border-collapse: collapse; margin-left: 18.714pt"
        cellspacing="0"
      >
        <tr style="height: 30pt">
          <td
            style="
              width: 42pt;
              border-top-style: solid;
              border-top-width: 1pt;
              border-left-style: solid;
              border-left-width: 1pt;
              border-bottom-style: solid;
              border-bottom-width: 1pt;
              border-right-style: solid;
              border-right-width: 1pt;
            "
          >
            <p
              class="s1"
              style="padding: 20px; text-indent: 0pt; text-align: center"
            >
              Loại điểm
            </p>
          </td>
          <td
            style="
              width: 42pt;
              border-top-style: solid;
              border-top-width: 1pt;
              border-left-style: solid;
              border-left-width: 1pt;
              border-bottom-style: solid;
              border-bottom-width: 1pt;
              border-right-style: solid;
              border-right-width: 1pt;
            "
          >
            <p
              class="s1"
              style="text-indent: 0pt; text-align: center"
            >
              ĐIỂM
            </p>
          </td>
          <td
            style="
              width: 139pt;
              border-top-style: solid;
              border-top-width: 1pt;
              border-left-style: solid;
              border-left-width: 1pt;
              border-bottom-style: solid;
              border-bottom-width: 1pt;
              border-right-style: solid;
              border-right-width: 1pt;
              padding: 10px;
            "
          >
            <p
              class="s1"
              style="
                padding-top: 5pt;
                padding-left: 19pt;
                text-indent: 0pt;
                text-align: left;
              "
            >
              Giảng viên cho điểm
            </p>
          </td>
          <td
            style="
              width: 139pt;
              border-top-style: solid;
              border-top-width: 1pt;
              border-left-style: solid;
              border-left-width: 1pt;
              border-bottom-style: solid;
              border-bottom-width: 1pt;
              border-right-style: solid;
              border-right-width: 1pt;
            "
          >
            <p
              class="s1"
              style="
                padding-top: 5pt;
                padding-left: 46pt;
                padding-right: 46pt;
                text-indent: 0pt;
                text-align: center;
              "
            >
              Nhận xét
            </p>
          </td>
        </tr>
        <tr style="height: 30pt">
          <td
            style="
              width: 42pt;
              border-top-style: solid;
              border-top-width: 1pt;
              border-left-style: solid;
              border-left-width: 1pt;
              border-bottom-style: solid;
              border-bottom-width: 1pt;
              border-right-style: solid;
              border-right-width: 1pt;
            "
          >
            <p style="text-indent: 0pt; text-align: left"><br /></p>
          </td>
          <td
            style="
              width: 159pt;
              border-top-style: solid;
              border-top-width: 1pt;
              border-left-style: solid;
              border-left-width: 1pt;
              border-bottom-style: solid;
              border-bottom-width: 1pt;
              border-right-style: solid;
              border-right-width: 1pt;
            "
          >
            <p style="text-indent: 0pt; text-align: left"><br /></p>
          </td>
          <td
            style="
              width: 139pt;
              border-top-style: solid;
              border-top-width: 1pt;
              border-left-style: solid;
              border-left-width: 1pt;
              border-bottom-style: solid;
              border-bottom-width: 1pt;
              border-right-style: solid;
              border-right-width: 1pt;
            "
          >
            <p style="text-indent: 0pt; text-align: left"><br /></p>
          </td>
          <td
            style="
              width: 139pt;
              border-top-style: solid;
              border-top-width: 1pt;
              border-left-style: solid;
              border-left-width: 1pt;
              border-bottom-style: solid;
              border-bottom-width: 1pt;
              border-right-style: solid;
              border-right-width: 1pt;
            "
          >
            <p style="text-indent: 0pt; text-align: left"><br /></p>
          </td>
        </tr>
      </table>
      <p style="text-indent: 0pt; text-align: left"><br /></p>
    </li>
    <li>
      <p style="padding-left: 36pt; text-indent: -12pt; text-align: left">
        Các nhận xét và đề nghị, câu hỏi phản biện:
      </p>
    </li>
  </ol>
  <p
    style="
      padding-top: 10pt;
      padding-left: 26pt;
      text-indent: 0pt;
      text-align: left;
    "
  >
    .......................................................................................................................................................
  </p>
  <p
    style="
      padding-top: 10pt;
      padding-left: 26pt;
      text-indent: 0pt;
      text-align: left;
    "
  >
    .......................................................................................................................................................
  </p>
  <p
    style="
      padding-top: 10pt;
      padding-left: 26pt;
      text-indent: 0pt;
      text-align: left;
    "
  >
    .......................................................................................................................................................
  </p>
  <h1
    style="
      padding-top: 10pt;
      padding-left: 24pt;
      text-indent: 0pt;
      text-align: left;
    "
  >
    Thành viên Hội đồng
  </h1>
  <p
    class="s5"
    style="padding-left: 30pt; text-indent: 0pt; text-align: left"
  >
    (Ký ghi rõ họ tên)
  </p>
  <p style="text-indent: 0pt; text-align: left"><br /></p>
  <p style="text-indent: 0pt; text-align: left"><br /></p>
  <p style="text-indent: 0pt; text-align: center">1</p>
</template>
<script setup lang="ts">
  import { ref, onMounted, defineProps } from 'vue';
  const { listMark, projectInfo, userData } = defineProps([
    'listMark',
    'projectInfo',
    'userData',
  ]); // Lấy props từ component cha truyền vào để sử dụng
</script>
<style>
  * {
    margin: 0;
    padding: 0;
    text-indent: 0;
  }

  .s1 {
    color: black;
    font-family: 'Times New Roman', serif;
    font-style: normal;
    font-weight: normal;
    text-decoration: none;
    font-size: 12pt;
  }

  .s2 {
    color: black;
    font-family: 'Times New Roman', serif;
    font-style: normal;
    font-weight: bold;
    text-decoration: none;
    font-size: 12pt;
  }

  .s3 {
    color: black;
    font-family: 'Times New Roman', serif;
    font-style: normal;
    font-weight: bold;
    text-decoration: none;
    font-size: 13pt;
  }

  .s4 {
    color: black;
    font-family: 'Times New Roman', serif;
    font-style: italic;
    font-weight: normal;
    text-decoration: none;
    font-size: 14pt;
  }

  h1 {
    color: black;
    font-family: 'Times New Roman', serif;
    font-style: normal;
    font-weight: bold;
    text-decoration: none;
    font-size: 12pt;
  }

  p {
    color: black;
    font-family: 'Times New Roman', serif;
    font-style: normal;
    font-weight: normal;
    text-decoration: none;
    font-size: 12pt;
    margin: 0pt;
  }

  .s5 {
    color: black;
    font-family: 'Times New Roman', serif;
    font-style: italic;
    font-weight: normal;
    text-decoration: none;
    font-size: 12pt;
  }

  li {
    display: block;
  }

  #l1 {
    padding-left: 0pt;
    counter-reset: c1 6;
  }

  #l1 > li > *:first-child:before {
    counter-increment: c1;
    content: counter(c1, decimal) '. ';
    color: black;
    font-family: 'YourVietnameseFont', sans-serif;
    font-style: normal;
    font-weight: normal;
    text-decoration: none;
    font-size: 12pt;
  }

  #l1 > li:first-child > *:first-child:before {
    counter-increment: c1 0;
  }

  table,
  tbody {
    vertical-align: top;
    overflow: visible;
  }
</style>
