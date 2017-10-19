<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>

<head>
    <%--Styles--%>
    <link rel="stylesheet" type="text/css" href="resources/css/style.css"/>
	<%--Isomorphic SmarClient init scripts	--%>
	<script>var isomorphicDir="/resources/lib/isomorphic/";</script>
	<script src="resources/lib/isomorphic/system/modules/ISC_Core.js"></script>
	<script src="resources/lib/isomorphic/system/modules/ISC_Foundation.js"></script>
	<script src="resources/lib/isomorphic/system/modules/ISC_Containers.js"></script>
	<script src="resources/lib/isomorphic/system/modules/ISC_Grids.js"></script>
	<script src="resources/lib/isomorphic/system/modules/ISC_Forms.js"></script>
	<script src="resources/lib/isomorphic/system/modules/ISC_DataBinding.js"></script>
	<script src="resources/lib/isomorphic/skins/Enterprise/load_skin.js"></script>

	<%--JQuery--%>
	<script src="resources/lib/jquery/jquery-1.11.3.js"></script>
	<%--Application layout--%>
	<script src="<c:url value="resources/app/layout.js" />"></script>

	<%--Application initialization script--%>
	<script  type="text/javascript">
		function initApplication() {
			console.info("Application initialization script");
			createLayout();
        }
	</script>

</head>

<body onload="initApplication()">
    <div w3-include-html="content.html"></div>
	<%--<img src="resources/img/logoBlack.png"/><br>--%>
	<%--<h1>${message}</h1> <br>--%>
	<%--<a href="logout" > Logout</a>--%>
</body>
</html>