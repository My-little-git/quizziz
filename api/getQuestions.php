<?php

require_once 'connect.php';

/**
 *@var PDO $db
 */


$sql_select_questions = "SELECT * from questions";

$query_select_questions = $db->query($sql_select_questions);

$questions = $query_select_questions->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($questions, JSON_UNESCAPED_UNICODE);
