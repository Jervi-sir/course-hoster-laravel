<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Completion - {{ $course->title }}</title>
    <style>
        @page {
            size: landscape;
            margin: 0;
        }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background: #fdfbf7;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: #333;
        }

        .container {
            width: 900px;
            height: 600px;
            background: #fff;
            padding: 40px;
            text-align: center;
            border: 20px solid #2d3748;
            position: relative;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }

        .inner-border {
            border: 2px solid #e2e8f0;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
        }

        h1 {
            font-size: 48px;
            text-transform: uppercase;
            margin: 0 0 10px 0;
            color: #2d3748;
            letter-spacing: 2px;
        }

        .subtitle {
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 40px;
            color: #718096;
        }

        .recipient {
            font-size: 36px;
            font-weight: bold;
            margin: 20px 0;
            color: #1a202c;
            border-bottom: 2px solid #cbd5e0;
            padding-bottom: 10px;
            display: inline-block;
            min-width: 400px;
        }

        .text {
            font-size: 18px;
            margin: 20px 0;
            color: #4a5568;
        }

        .course-title {
            font-size: 28px;
            font-weight: bold;
            color: #2b6cb0;
            margin: 10px 0 30px 0;
        }

        .date {
            margin-top: 40px;
            font-size: 16px;
            color: #718096;
        }

        .id {
            position: absolute;
            bottom: 20px;
            right: 20px;
            font-size: 12px;
            color: #cbd5e0;
        }

        .logo {
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 30px;
            color: #2d3748;
        }

        @media print {
            body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }

            .container {
                box-shadow: none;
                width: 100%;
                height: 100%;
                border-width: 10px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="inner-border">
            <div class="logo">{{ config('app.name') }}</div>

            <h1>Certificate of Completion</h1>
            <div class="subtitle">This verifies that</div>

            <div class="recipient">{{ $user->name }}</div>

            <div class="text">has successfully completed the course</div>

            <div class="course-title">{{ $course->title }}</div>

            <div class="date">Given on {{ $date }}</div>

            <div class="id">ID: {{ $id }}</div>
        </div>
    </div>
    <script>
        window.onload = function() {
            // Automatically prompt print dialog
            // window.print();
        }
    </script>
</body>

</html>