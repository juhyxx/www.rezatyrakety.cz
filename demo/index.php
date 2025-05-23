<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <meta name="viewport" content="width = device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&family=Oswald:wght@200;700&display=swap');


        body {
            background: #9b1915;
            padding: 0rem;
            margin: 0;
            font-family: 'Oswald', sans-serif;
        }

        .list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            padding: 0rem;
            flex-direction: column;

            @media screen and (min-width: 800px) {
                flex-direction: row;
            }
        }

        div.item {
            margin: 0.1em;
            background-color: white;
            padding: 0.5rem 0 0.5rem 0;
            border-radius: 3px border: 1px solid gray;
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.2);
            text-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.2);

            @media screen and (min-width: 800px) {
                width: 44rem;
            }

            &:not(.old) {
                counter-increment: css-counter 1;
            }

            &.collapsed {
                ul {
                    max-height: 0;
                    overflow: hidden;
                }
            }

            &.old {
                background-color: gray;
            }

            &.new {
                h2 {
                    .container {
                        div:first-child:after {
                            content: "Nové";
                            background-color:rgb(230, 212, 18);
                            color: white;
                            font-size: 0.5rem;
                            padding: 0.25rem;
                            margin-left: 1rem;
                            position: absolute;
                            transform: rotate(-25deg);
                            box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
                            border-radius: 0.5rem;
                        }
                    }
                }
            }

            &.progress {
                background-color:rgb(232, 254, 255);
            }

            cursor: pointer;
            box-shadow: inset 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
        }

        h2 {
            font-size: 1rem;
            text-align: left;
            padding: 0;
            padding-left: 0.5rem;
            margin: 0;
            text-transform: uppercase;
            color: #9b1915;
            text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.4);
            display: flex;
            justify-content: space-between;

            padding-right: 1rem;

            .container {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;

                div:last-child {
                    color: gray;
                }
            }


            &:before {
                content: "◢ " counter(css-counter) ". ";
            }

            .collapsed &:before {
                content: "▷ " counter(css-counter) ". ";
            }

        }

        ul {
            padding: 0;
            margin: 0;
            list-style-type: none;
            display: flex;
            flex-wrap: wrap;
            transition: max-height 1s ease;
            max-height: 200px;
        }

        li {

            margin: 0.25em;
            border-radius: 0.5em;
            text-align: center;


            a {
                padding: 0.25em;
                text-decoration: none;
                text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.2);
                display: block;
                min-width: 2em;
                min-width: 2em;
                color: rgb(107, 107, 107);

                i.fa {
                    font-size: 1.5em;
                }

            }

            &.audio {
                a {
                    color: rgb(21, 61, 155);
                }
            }

            &.pdf {
                a {
                    color: #9b1915;
                }

            }

            &:hover {
                background-color: white;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.2);

                a {
                    text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.2);
                }
            }
        }

        #event {
            background-color: white;
            padding: 1rem;
            box-shadow: 4px 0px 7px 0px rgba(0, 0, 0, 0.2);
        }
    </style>

</head>

<body>
    <div id="event">Načítání...</div>
    <script>
        const API_KEY = "AIzaSyBxSP7qbnpzphJzT3yeRoc0XmreUx9DM2I"; // Nahraď vlastním API klíčem
        const CALENDAR_ID = "48jdqagdt2v2uhhd8afgcn2fc8@group.calendar.google.com";
        const URL = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${new Date().toISOString()}&maxResults=1&singleEvents=true&orderBy=startTime`;

        function loadCalendar() {
            fetch(URL)
                .then(response => response.json())
                .then(data => {
                    const event = data.items ? data.items[0] : null;
                    if (event) {
                        const title = event.summary;
                        const when = event.start.dateTime || event.start.date;
                        document.getElementById("event").innerHTML = `<i class="fa fa-solid fa-calendar"></i> <b>${title}</b>  ${new Date(when).toLocaleString()}  <a href="https://calendar.google.com/calendar/u/0/embed?src=48jdqagdt2v2uhhd8afgcn2fc8@group.calendar.google.com&ctz=Europe/Prague">Kalendář</a>`;
                    } else {
                        document.getElementById("event").innerHTML = "Žádné nadcházející události.";
                    }
                })
                .catch(error => {
                    console.error("Chyba při načítání kalendáře:", error);
                    document.getElementById("event").innerHTML = "Chyba při načítání dat.";
                });
        }

        loadCalendar();
    </script>
    <div class="list">
        <?


        function getMP3Duration($filename)
        {
            $fp = fopen($filename, "rb");
            if (!$fp) return false;

            $header = fread($fp, 10000); // načteme začátek souboru
            fclose($fp);

            // Najdi pozici "Xing" nebo "Info"
            $xingPos = strpos($header, 'Xing');
            if ($xingPos === false) $xingPos = strpos($header, 'Info');
            if ($xingPos === false) return false;

            // Načti počet rámců (frames)
            $data = unpack("Nframes", substr($header, $xingPos + 8, 4));
            if (!$data || !isset($data['frames'])) return false;

            $frames = $data['frames'];

            // Najdi první MP3 frame pro zjištění bitrate
            if (!preg_match('/\xFF[\xE0-\xFF][\x00-\xFF]{2}/', $header, $match, PREG_OFFSET_CAPTURE)) {
                return false;
            }

            $offset = $match[0][1];
            $byte2 = ord($header[$offset + 2]);
            $bitrateIndex = ($byte2 & 0xF0) >> 4;

            $bitrates = array(0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320);
            if (!isset($bitrates[$bitrateIndex])) return false;
            $bitrate = $bitrates[$bitrateIndex] * 1000;

            // Každý frame = 1152 vzorků, vzorkovací frekvence = 44100 Hz
            $duration = ($frames * 1152) / 44100;

            return gmdate("i:s", $duration);
        }

        function sortByExtension($a, $b)
        {
            return strcmp($a["extension"], $b["extension"]);
        }
        function sortByName($a, $b)
        {
            $e = strcmp($a["old"], $b["old"]);
            if ($e != 0) {
                return $e;
            }
            return strcmp($a["name"], $b["name"]);
        }

        $icons = array(
            "pdf" => "fa-file-pdf-o",
            "md" => "fa-file-text-o",
            "mp3" => "fa-volume-up"
        );
        $clss = array(
            "pdf" => "pdf",
            "md" => "text",
            "mp3" => "audio"
        );
        $songs = array();
        $folder =  array_diff(scandir("data"), array('..', '.', '.DS_Store'));

        foreach ($folder as $item) {
            $song = array();
            $song['name'] = str_replace("_", " ", $item);
            $song['path'] = "$item";
            $song['playtime'] = "";
            $song["extension"] = pathinfo($song['name'], PATHINFO_EXTENSION);
            // $song["old"] =  pathinfo($item, PATHINFO_EXTENSION) == "old";
            $song["files"] = array();
            $files = array_diff(scandir("data/" . $item), array('..', '.', '.DS_Store'));
            foreach ($files as $file) {
                if ($file == "manifest.json") {
                    $string = file_get_contents("data/$item/$file");
                    $manifest = json_decode($string, true);
                    foreach ($manifest as $prop => $value) {
                        $song[$prop] = $value;
                    }
                    continue;
                }
                $fileData = array();
                $fileData["extension"] = pathinfo($file, PATHINFO_EXTENSION);
                $fileData["icon"] = $icons[$fileData["extension"]];
                $fileData["name"] = pathinfo($file, PATHINFO_FILENAME);
                if ($fileData["extension"] == "mp3" && $fileData["name"]  == "demo") {
                    $filePath = "data/$item/$file";
                    $song['playtime'] =  getMP3Duration($filePath);
                }
                array_push($song["files"], $fileData);
            }
            uasort($song["files"], 'sortByExtension');
            array_push($songs, $song);
        }
        uasort($songs, 'sortByName');

        foreach ($songs as $song) {
            echo "<div class='item {$song["extension"]} " . ($song["progress"] ? "progress" : "") . " " . ($song["new"] ? "new" : "") . " " . ($song["old"] ? "old" : "") . "  collapsed' onclick='toggle(this)'>";
            echo "<h2><div class='container'><div>{$song["name"]}</div><div>{$song["playtime"]}</div></div></h2>";
            echo "<ul>";
            foreach ($song["files"] as $file) {
                $href = $file["extension"] === "md"
                    ? "text.html?song={$song["path"]}"
                    : "data/{$song["path"]}/{$file["name"]}.{$file["extension"]}";

                echo "<li class='{$clss[$file["extension"]]}'><a href='{$href}'>" .
                    "<i class='fa {$file["icon"]}'></i><br>{$file["name"]}</a>" .
                    "</li>";
            }
            echo "</ul></div>";
        }
        ?>
    </div>
    <script>
        window.location.search.replace("?", "").split("&").forEach(function(item) {
            let [param, values] = item.split("=");

            if (param === "select") {
                values.split(",")?.forEach((value) => {
                    let el = document.querySelector(`div.item:nth-child(${value})`);
                    if (el) {
                        el.classList.add("selected");
                    }
                });
            }
        });

        function toggle(el) {
            el.classList.toggle("collapsed")
        }
    </script>
</body>

</html>