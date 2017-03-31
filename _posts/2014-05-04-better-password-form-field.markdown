---
layout: post
title: "请输入密码"
date: 2014-05-04 09:33:43 +0800
comments: true
categories: 
- playground
- web
---

午饭之前的这点儿垃圾时间闲着也是闲着，大多数网站让用户输入密码都做得不够温柔。什么样是温柔呢？不打扰就是温柔...

  <link rel="stylesheet" href="/downloads/static/css/flip_animations.css">
  <link rel="stylesheet" href="/downloads/static/css/better_password_form_field.css">

<div id='better-password-container'>
    <div class="top"></div>
    <div class="middle">
      <div class="left"></div>
      <div class="middle">
        <div id="form-container">

          <div id="all-done">谢谢</div>

          <form id="verify-new-password">
            <label for="verify-password">请再次输入你的密码</label>
            <input placeholder="请再次输入你的密码" type="password" id="verify-password" name="password-to-verify" />
            <ul>
              <li id="matches-password">输入正确</li>
            </ul>

            <input type="submit" id="verify-password-submit" value="确认" disabled="disabled">
            <button id="go-back">返回</button>
          </form>

          <form id="new-password">
            <label for="password">请输入密码</label>
            <input placeholder="请输入密码" type="password" id="password" name="password" />
            <ul>
              <li id="eight-plus">最少8位</li>
              <li id="uppercase">必须包含大写字母</li>
              <li id="lowercase">必须包含小写字母</li>
              <li id="numbers">必须包含数字</li>
              <li id="punctuation">必须包含符号</li>
            </ul>

            <input type="submit" id="password-submit" value="下一步" disabled="disabled">
          </form>

        </div>
      </div>
      <div class="right"></div>
    </div>
    <div class="bottom"></div>
  </div>

  <script src="/downloads/static/js/better_password_form_field.js"></script>
