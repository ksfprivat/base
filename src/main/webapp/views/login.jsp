<%--@elvariable id="_csrf" type="org.springframework.security.web.csrf.CsrfAuthenticationStrategy.SaveOnAccessCsrfToken"--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html >
<head>
    <meta charset="UTF-8">
    <title>Login Form</title>

    <link rel="stylesheet" type="text/css" href="resources/css/login.css">

</head>

<body background="resources/img/bg.jpg">

<div class="login">

    <div class="logo-img">
        <img src="resources/img/login-logo.png"/>
    </div>

    <form name='f' method="post" action="login">
        <input type="text" name="username" placeholder="Пользователь" required="required" />
        <input type="password" name="password" placeholder="Пароль" required="required" />
        <c:if test="${not empty error}">
            <div class="error-text">
                    ${error}</div>
        </c:if>
        <button type="submit" class="btn btn-primary btn-block btn-large">Вход</button>
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
    </form>

</div>
<div class="copyright-text">
    BASE CRM 2018
</div>

</body>
</html>
