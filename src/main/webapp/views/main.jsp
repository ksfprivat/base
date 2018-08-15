<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>

<head>
    <%--Styles--%>
    <link rel="stylesheet" type="text/css" href="resources/css/style.css"/>
	<link rel="shortcut icon" href="resources/icons/favicon.ico" type="image/x-icon">

    <%--JQuery--%>
    <script src="<c:url value="resources/lib/jquery/jquery-1.11.3.js"/>"></script>

	<%--PDF make library--%>
	<script src="<c:url value="resources/lib/pdfmake/pdfmake.min.js"/>"></script>
	<script src="<c:url value="resources/lib/pdfmake/vfs_fonts.js"/>"></script>

	<%--Excel export library--%>
	<script src="<c:url value="resources/lib/xlsExport/xls-export.js"/>"></script>

    <%--Chartist--%>
	<link rel="stylesheet" type="text/css" href="resources/lib/charts/chartist.min.css"/>
    <script src="<c:url value="resources/lib/charts/chartist.min.js"/>"></script>
	<%--Isomorphic SmarClient init scripts	--%>
	<script>var isomorphicDir="/resources/lib/isomorphic/";</script>
	<script src="<c:url value="resources/lib/isomorphic/system/modules/ISC_Core.js"/>"></script>
	<script src="<c:url value="resources/lib/isomorphic/system/modules/ISC_Foundation.js"/>"></script>
	<script src="<c:url value="resources/lib/isomorphic/system/modules/ISC_Containers.js"/>"></script>
	<script src="<c:url value="resources/lib/isomorphic/system/modules/ISC_Grids.js"/>"></script>
	<script src="<c:url value="resources/lib/isomorphic/system/modules/ISC_Forms.js"/>"></script>
	<script src="<c:url value="resources/lib/isomorphic/system/modules/ISC_DataBinding.js"/>"></script>
    <script src="<c:url value="resources/lib/isomorphic/locales/frameworkMessages_ru.js"/>"></script>
    <script src="<c:url value="resources/lib/isomorphic/skins/Tahoe/load_skin.js"/>"></script>

    <%--Utilites	--%>
    <script src="<c:url value="resources/app/utils/dateUtils.js"/>"></script>

	<%--Application layout--%>
    <script src="<c:url value="resources/app/header.js" />"></script>
    <script src="<c:url value="resources/app/layout.js" />"></script>

    <%--Data binding    --%>
	<script src="<c:url value="resources/app/dataBinding/customers.js" />"></script>
    <script src="<c:url value="resources/app/dataBinding/contracts.js" />"></script>
    <script src="<c:url value="resources/app/dataBinding/contacts.js" />"></script>

    <%--UI elements   --%>
	<script src="<c:url value="resources/app/forms/searchBar.js"/>"></script>
	<script src="<c:url value="resources/app/forms/customerForm.js"/>"></script>
	<script src="<c:url value="resources/app/forms/contactsForm.js"/>"></script>
	<script src="<c:url value="resources/app/forms/contractsForm.js"/>"></script>

	<script src="<c:url value="resources/app/windows/customerWindow.js"/>"></script>
	<script src="<c:url value="resources/app/windows/contactWindow.js"/>"></script>
	<script src="<c:url value="resources/app/windows/contractWindow.js"/>"></script>
    <script src="<c:url value="resources/app/windows/splashWindow.js" />"></script>

    <script src="<c:url value="resources/app/frames/navContactsGrid.js"/>"></script>
	<script src="<c:url value="resources/app/frames/navContractsGrid.js"/>"></script>
	<script src="<c:url value="resources/app/frames/browserFrame.js" />"></script>
	<script src="<c:url value="resources/app/frames/navigationFrame.js" />"></script>
	<script src="<c:url value="resources/app/frames/sideBarFrame.js" />"></script>
	<script src="<c:url value="resources/app/frames/dashboardFrame.js" />"></script>
	<script src="<c:url value="resources/app/frames/reportsFrame.js" />"></script>
    <script src="<c:url value="resources/app/frames/helpFrame.js" />"></script>
	<script src="<c:url value="resources/app/frames/dummyFrame.js" />"></script>

	<script src="<c:url value="resources/app/reports/contractsReport.js" />"></script>
	<%--Application initialization script--%>
	<script  type="text/javascript">

        function initApplication() {
     	    isc.Canvas.resizeFonts(3);
            isc.Canvas.resizeControls(8);
            SplashWindow.create();
            createLayout();
            sideBar.setAppState(1)
        }
	</script>

</head>

<body onLoad="initApplication()">


</body>
</html>