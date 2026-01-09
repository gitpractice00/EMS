<mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1200" pageHeight="2400" math="0" shadow="0">
  <root>
    <mxCell id="0" />
    <mxCell id="1" parent="0" />
    
    <!-- Title -->
    <mxCell id="title_flow" value="MAIN SYSTEM FLOWCHART - Employee Management System" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=24;fontStyle=1;fontColor=#1a1a1a;" vertex="1" parent="1">
      <mxGeometry x="200" y="20" width="800" height="40" as="geometry" />
    </mxCell>

    <!-- Start -->
    <mxCell id="start" value="START" style="strokeWidth=2;html=1;shape=mxgraph.flowchart.terminator;whiteSpace=wrap;fillColor=#4caf50;strokeColor=#2e7d32;fontSize=14;fontStyle=1;fontColor=#FFFFFF;" vertex="1" parent="1">
      <mxGeometry x="500" y="80" width="200" height="60" as="geometry" />
    </mxCell>

    <!-- Open Application -->
    <mxCell id="open_app" value="User Opens&#xa;Application" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#e3f2fd;strokeColor=#1976d2;strokeWidth=2;fontSize=13;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="500" y="180" width="200" height="60" as="geometry" />
    </mxCell>
    <mxCell id="flow1" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="start" target="open_app">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Display Login Page -->
    <mxCell id="login_page" value="Display&#xa;Login Page" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;fillColor=#fff9c4;strokeColor=#f57f17;strokeWidth=2;fontSize=13;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="500" y="280" width="200" height="60" as="geometry" />
    </mxCell>
    <mxCell id="flow2" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="open_app" target="login_page">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Enter Credentials -->
    <mxCell id="enter_cred" value="Admin Enters&amp;#xa;Email &amp; Password" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;fillColor=#fff9c4;strokeColor=#f57f17;strokeWidth=2;fontSize=13;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="500" y="380" width="200" height="60" as="geometry" />
    </mxCell>
    <mxCell id="flow3" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="login_page" target="enter_cred">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Validate Credentials -->
    <mxCell id="validate" value="Validate&amp;#xa;Credentials&amp;
    #xa;in Database" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#e1bee7;strokeColor=#7b1fa2;strokeWidth=2;fontSize=13;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="500" y="480" width="200" height="60" as="geometry" />
    </mxCell>
    <mxCell id="flow4" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="enter_cred" target="validate">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Decision: Valid? -->
    <mxCell id="decision1" value="Valid&#xa;Credentials?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#ffccbc;strokeColor=#d84315;strokeWidth=2;fontSize=13;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="500" y="580" width="200" height="100" as="geometry" />
    </mxCell>
    <mxCell id="flow5" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="validate" target="decision1">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Invalid Path -->
    <mxCell id="error_msg" value="Display&#xa;Error Message" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;fillColor=#ffcdd2;strokeColor=#c62828;strokeWidth=2;fontSize=13;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="800" y="600" width="200" height="60" as="geometry" />
    </mxCell>
    <mxCell id="flow6" value="NO" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#c62828;fontStyle=1;fontSize=12;" edge="1" parent="1" source="decision1" target="error_msg">
      <mxGeometry x="-0.2" y="15" width="50" height="50" relative="1" as="geometry">
        <mxPoint as="offset" />
      </mxGeometry>
    </mxCell>

    <!-- Loop Back -->
    <mxCell id="flow7" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#c62828;exitX=0.5;exitY=0;exitDx=0;exitDy=0;entryX=1;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="error_msg" target="enter_cred">
      <mxGeometry width="50" height="50" relative="1" as="geometry">
        <mxPoint x="900" y="410" as="sourcePoint" />
        <mxPoint x="700" y="410" as="targetPoint" />
        <Array as="points">
          <mxPoint x="900" y="410" />
        </Array>
      </mxGeometry>
    </mxCell>
    <mxCell id="flow7_label" value="Retry" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];fontSize=11;fontColor=#c62828;fontStyle=1;backgroundColor=#ffebee;" vertex="1" connectable="0" parent="flow7">
      <mxGeometry x="-0.5" y="2" relative="1" as="geometry">
        <mxPoint x="20" y="-8" as="offset" />
      </mxGeometry>
    </mxCell>

    <!-- Generate Token -->
    <mxCell id="gen_token" value="Generate&#xa;JWT Token" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#c8e6c9;strokeColor=#2e7d32;strokeWidth=2;fontSize=13;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="500" y="720" width="200" height="60" as="geometry" />
    </mxCell>
    <mxCell id="flow8" value="YES" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#2e7d32;fontStyle=1;fontSize=12;" edge="1" parent="1" source="decision1" target="gen_token">
      <mxGeometry x="-0.2" y="-15" width="50" height="50" relative="1" as="geometry">
        <mxPoint as="offset" />
      </mxGeometry>
    </mxCell>

    <!-- Display Dashboard -->
    <mxCell id="dashboard" value="Display&#xa;Dashboard" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;fillColor=#b2dfdb;strokeColor=#00695c;strokeWidth=2;fontSize=13;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="500" y="820" width="200" height="60" as="geometry" />
    </mxCell>
    <mxCell id="flow9" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="gen_token" target="dashboard">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Load Data -->
    <mxCell id="load_data" value="Load Employees,&#xa;Attendance,&#xa;Payroll Data" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#e1bee7;strokeColor=#7b1fa2;strokeWidth=2;fontSize=13;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="500" y="920" width="200" height="60" as="geometry" />
    </mxCell>
    <mxCell id="flow10" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="dashboard" target="load_data">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Main Menu Decision -->
    <mxCell id="main_menu" value="Select&#xa;Operation" style="rhombus;whiteSpace=wrap;html=1;fillColor=#ffe0b2;strokeColor=#ef6c00;strokeWidth=2;fontSize=13;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="500" y="1020" width="200" height="100" as="geometry" />
    </mxCell>
    <mxCell id="flow11" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="load_data" target="main_menu">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Employee Management -->
    <mxCell id="emp_mgmt" value="EMPLOYEE&#xa;MANAGEMENT&#xa;(Add/Edit/Delete)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;strokeWidth=2;fontSize=12;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="200" y="1180" width="150" height="80" as="geometry" />
    </mxCell>
    <mxCell id="flow12" value="Option 1" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#82b366;fontStyle=1;fontSize=11;" edge="1" parent="1" source="main_menu" target="emp_mgmt">
      <mxGeometry x="-0.2" y="10" width="50" height="50" relative="1" as="geometry">
        <mxPoint as="offset" />
      </mxGeometry>
    </mxCell>

    <!-- Attendance -->
    <mxCell id="attendance" value="ATTENDANCE&#xa;TRACKING&#xa;(Mark/View)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;strokeWidth=2;fontSize=12;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="400" y="1180" width="150" height="80" as="geometry" />
    </mxCell>
    <mxCell id="flow13" value="Option 2" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#d6b656;fontStyle=1;fontSize=11;" edge="1" parent="1" source="main_menu" target="attendance">
      <mxGeometry x="-0.2" y="10" width="50" height="50" relative="1" as="geometry">
        <mxPoint as="offset" />
      </mxGeometry>
    </mxCell>

    <!-- Payroll -->
    <mxCell id="payroll" value="PAYROLL&#xa;MANAGEMENT&#xa;(Calculate/Pay)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;strokeWidth=2;fontSize=12;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="600" y="1180" width="150" height="80" as="geometry" />
    </mxCell>
    <mxCell id="flow14" value="Option 3" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#9673a6;fontStyle=1;fontSize=11;" edge="1" parent="1" source="main_menu" target="payroll">
      <mxGeometry x="-0.2" y="10" width="50" height="50" relative="1" as="geometry">
        <mxPoint as="offset" />
      </mxGeometry>
    </mxCell>

    <!-- Logout -->
    <mxCell id="logout" value="LOGOUT" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffcdd2;strokeColor=#c62828;strokeWidth=2;fontSize=12;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="800" y="1180" width="150" height="80" as="geometry" />
    </mxCell>
    <mxCell id="flow15" value="Option 4" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#c62828;fontStyle=1;fontSize=11;" edge="1" parent="1" source="main_menu" target="logout">
      <mxGeometry x="-0.2" y="10" width="50" height="50" relative="1" as="geometry">
        <mxPoint as="offset" />
      </mxGeometry>
    </mxCell>

    <!-- CRUD Operations -->
    <mxCell id="crud_ops" value="Perform CRUD&#xa;Operations on&#xa;Employees Table" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#c8e6c9;strokeColor=#2e7d32;strokeWidth=2;fontSize=12;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="200" y="1300" width="150" height="80" as="geometry" />
    </mxCell>
    <mxCell id="flow16" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="emp_mgmt" target="crud_ops">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Check if Delete -->
    <mxCell id="delete_check" value="Delete&#xa;Operation?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#ffccbc;strokeColor=#d84315;strokeWidth=2;fontSize=12;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="200" y="1420" width="150" height="80" as="geometry" />
    </mxCell>
    <mxCell id="flow17" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="crud_ops" target="delete_check">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Archive Employee -->
    <mxCell id="archive" value="Copy to&#xa;Employees_Archive&#xa;+ CASCADE Delete" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;strokeWidth=2;fontSize=11;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="50" y="1540" width="150" height="80" as="geometry" />
    </mxCell>
    <mxCell id="flow18" value="YES" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#c62828;fontStyle=1;fontSize=11;" edge="1" parent="1" source="delete_check" target="archive">
      <mxGeometry x="-0.2" y="10" width="50" height="50" relative="1" as="geometry">
        <mxPoint as="offset" />
      </mxGeometry>
    </mxCell>

    <!-- Success Message 1 -->
    <mxCell id="success1" value="Display&#xa;Success Message" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;fillColor=#c8e6c9;strokeColor=#2e7d32;strokeWidth=2;fontSize=12;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="350" y="1540" width="150" height="60" as="geometry" />
    </mxCell>
    <mxCell id="flow19" value="NO" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#2e7d32;fontStyle=1;fontSize=11;" edge="1" parent="1" source="delete_check" target="success1">
      <mxGeometry x="-0.2" y="10" width="50" height="50" relative="1" as="geometry">
        <mxPoint as="offset" />
      </mxGeometry>
    </mxCell>
    <mxCell id="flow20" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="archive" target="success1">
      <mxGeometry width="50" height="50" relative="1" as="geometry">
        <mxPoint x="200" y="1580" as="sourcePoint" />
        <mxPoint x="350" y="1570" as="targetPoint" />
      </mxGeometry>
    </mxCell>

    <!-- Mark Attendance -->
    <mxCell id="mark_att" value="Select Date&amp;#xa;&amp; Mark Status&amp;#xa;(Present/Absent/Leave)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff9c4;strokeColor=#f57f17;strokeWidth=2;fontSize=11;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="400" y="1300" width="150" height="80" as="geometry" />
    </mxCell>
    <mxCell id="flow21" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="attendance" target="mark_att">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Save Attendance -->
    <mxCell id="save_att" value="Save to&#xa;Attendance Table&#xa;(FK: employee_id)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#c8e6c9;strokeColor=#2e7d32;strokeWidth=2;fontSize=11;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="400" y="1420" width="150" height="80" as="geometry" />
    </mxCell>
    <mxCell id="flow22" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="mark_att" target="save_att">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Success Message 2 -->
    <mxCell id="success2" value="Display&#xa;Confirmation" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;fillColor=#c8e6c9;strokeColor=#2e7d32;strokeWidth=2;fontSize=12;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="400" y="1540" width="150" height="60" as="geometry" />
    </mxCell>
    <mxCell id="flow23" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="save_att" target="success2">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Calculate Payroll -->
    <mxCell id="calc_pay" value="Enter Salary Details&#xa;(Basic, Allowances,&#xa;Deductions, Days)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#e1bee7;strokeColor=#7b1fa2;strokeWidth=2;fontSize=11;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="600" y="1300" width="150" height="80" as="geometry" />
    </mxCell>
    <mxCell id="flow24" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="payroll" target="calc_pay">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Calculate Net -->
    <mxCell id="calc_net" value="Calculate&#xa;Net Salary&#xa;(Formula Applied)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffe0b2;strokeColor=#ef6c00;strokeWidth=2;fontSize=11;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="600" y="1420" width="150" height="80" as="geometry" />
    </mxCell>
    <mxCell id="flow25" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="calc_pay" target="calc_net">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Save Payroll -->
    <mxCell id="save_pay" value="Save to&amp;#xa;Payroll Table&amp;#xa;+ Mark as Paid" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#c8e6c9;strokeColor=#2e7d32;strokeWidth=2;fontSize=11;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="600" y="1540" width="150" height="80" as="geometry" />
    </mxCell>
    <mxCell id="flow26" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="calc_net" target="save_pay">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Success Message 3 -->
    <mxCell id="success3" value="Display&amp;#xa;Payroll Saved" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;fillColor=#c8e6c9;strokeColor=#2e7d32;strokeWidth=2;fontSize=12;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="600" y="1660" width="150" height="60" as="geometry" />
    </mxCell>
    <mxCell id="flow27" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="save_pay" target="success3">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Logout Process -->
    <mxCell id="logout_proc" value="Clear Session&amp;#xa;&amp; JWT Token" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffcdd2;strokeColor=#c62828;strokeWidth=2;fontSize=12;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="800" y="1300" width="150" height="80" as="geometry" />
    </mxCell>
    <mxCell id="flow28" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="logout" target="logout_proc">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Redirect to Login -->
    <mxCell id="redir_login" value="Redirect to&amp;#xa;Login Page" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;fillColor=#fff9c4;strokeColor=#f57f17;strokeWidth=2;fontSize=12;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="800" y="1420" width="150" height="60" as="geometry" />
    </mxCell>
    <mxCell id="flow29" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="logout_proc" target="redir_login">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Convergence Point -->
    <mxCell id="converge" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#000000;strokeColor=#000000;strokeWidth=2;" vertex="1" parent="1">
      <mxGeometry x="590" y="1750" width="20" height="20" as="geometry" />
    </mxCell>
    
    <!-- Flow to convergence -->
    <mxCell id="flow30" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;exitX=0.5;exitY=1;exitDx=0;exitDy=0;" edge="1" parent="1" source="success1" target="converge">
      <mxGeometry width="50" height="50" relative="1" as="geometry">
        <mxPoint x="425" y="1600" as="sourcePoint" />
        <mxPoint x="600" y="1750" as="targetPoint" />
        <Array as="points">
          <mxPoint x="425" y="1760" />
        </Array>
      </mxGeometry>
    </mxCell>
    <mxCell id="flow31" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;exitX=0.5;exitY=1;exitDx=0;exitDy=0;" edge="1" parent="1" source="success2" target="converge">
      <mxGeometry width="50" height="50" relative="1" as="geometry">
        <mxPoint x="475" y="1600" as="sourcePoint" />
        <mxPoint x="600" y="1760" as="targetPoint" />
        <Array as="points">
          <mxPoint x="475" y="1760" />
        </Array>
      </mxGeometry>
    </mxCell>
    <mxCell id="flow32" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;exitX=0.5;exitY=1;exitDx=0;exitDy=0;" edge="1" parent="1" source="success3" target="converge">
      <mxGeometry width="50" height="50" relative="1" as="geometry">
        <mxPoint x="675" y="1720" as="sourcePoint" />
        <mxPoint x="600" y="1760" as="targetPoint" />
        <Array as="points">
          <mxPoint x="675" y="1760" />
        </Array>
      </mxGeometry>
    </mxCell>
    <mxCell id="flow33" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;exitX=0.5;exitY=1;exitDx=0;exitDy=0;" edge="1" parent="1" source="redir_login" target="converge">
      <mxGeometry width="50" height="50" relative="1" as="geometry">
        <mxPoint x="875" y="1480" as="sourcePoint" />
        <mxPoint x="600" y="1760" as="targetPoint" />
        <Array as="points">
          <mxPoint x="875" y="1760" />
        </Array>
      </mxGeometry>
    </mxCell>

    <!-- Continue? Decision -->
    <mxCell id="continue_decision" value="Continue&amp;#xa;Using System?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#e3f2fd;strokeColor=#1976d2;strokeWidth=2;fontSize=13;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="500" y="1810" width="200" height="100" as="geometry" />
    </mxCell>
    <mxCell id="flow34" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="converge" target="continue_decision">
      <mxGeometry width="50" height="50" relative="1" as="geometry" />
    </mxCell>

    <!-- Loop Back to Main Menu -->
    <mxCell id="flow35" value="YES" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#2e7d32;exitX=0;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;fontStyle=1;fontSize=12;" edge="1" parent="1" source="continue_decision" target="main_menu">
  </root>
</mxGraphModel>
