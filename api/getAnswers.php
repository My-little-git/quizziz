<?php

require_once 'connect.php';

/**
 *@var PDO $db
 */

$sql_select_answers = "select * from answers";

$query_select_answers = $db->query($sql_select_answers);

$answers = $query_select_answers->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($answers, JSON_UNESCAPED_UNICODE);